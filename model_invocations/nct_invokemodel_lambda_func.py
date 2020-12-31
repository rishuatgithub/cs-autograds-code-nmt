import os
import io
import boto3
import json
import base64
from _ast import AST
import ast
import json

MODEL_ENDPOINT=os.environ['ENDPOINT_NAME']
runtime = boto3.client('runtime.sagemaker')

OPERATORS=['+','-','*','/','%','**','//','=','+=','-=','*=','/=','%=','//=','**=','&=','|=','^=',
'>>=','<<=','==','!=','>','<','>=','<=','and','or','not','is','is not','in','not in','&',
'|','^','~','<<','>>',':',')']

def beautify_pycode(data):
    '''
        This code beautifies the model output in python.
    '''
    x=' '.join(data).split('NEW_LINE')
    
    indent_count = 0
    output=[]
    rm=[]
    
    for items in x:
        o = []
        token = items.strip().split(' ')
        for t in token:
            if t == 'INDENT':
                indent_count+=1
            elif t == 'DEDENT':
                indent_count-=1
            else:
                o.append(' '*3*indent_count+t)
        
        output.append(o)

    temp_out = [' '.join(o) for o in output]
    
    
    for m in temp_out:
        cn = m.split(' '*3)
        rmm=[]
        found_text=0
        
        for c in cn:
            if c.strip() != '':
                found_text+=1

            if c.strip() in OPERATORS:
                rmm.append(c.strip()+' ')
            elif c.strip() == '' and found_text>0:
                continue
            elif c.strip() != '':
                rmm.append(c.strip()+' ')
            else:
                rmm.append(' '*3)
        rm.append(rmm)
    
    output_cleaned = [''.join(o).replace(' : ',':').replace(' ( ','(').replace(' )',')').replace(' . ','.') for o in rm]
    
    return str('\n'.join(output_cleaned).replace(' ▁ ','').strip())


def ast2json(node):
    if not isinstance(node, AST):
        raise TypeError( 'expected AST, got %r' % node.__class__.__name__ )
        
    def _format( node ):
        if isinstance(node, AST):
            fields = [('_PyType', _format( node.__class__.__name__ ))]
            fields += [( a, _format(b)) for a, b in iter_fields( node )]
            return '{ %s }' % ', '.join(( '"%s": %s' % field for field in fields))

        if isinstance( node, list ):
            return '[ %s ]' % ', '.join([ _format( x ) for x in node ])

        return json.dumps( node )
    
    return _format( node )

def iter_fields(node):
    for field in node._fields:
        try:
            yield field, getattr( node, field )
        except AttributeError:
            pass

def parse_py_ast(data):
    '''
        This code generates the AST for the model output for python.
    '''
    datap = ast.parse(data)
    a2j = ast2json(datap)

    return a2j
    

def get_summary_sample(data):
    '''
        This is a sample code for summary generation
    '''
    if 'countFromArray' in data:
        output = [{ "description":"[Experimental] This code snippet represents a COUNT CHECK",
             "probability":89
             },
             { "description":"[Experimental] This code snippet represents a SUM",
             "probability":2
             },
             { "description":"[Experimental] This code snippet represents a PRIME t",
             "probability":0.05
             }]
    elif 'httpRequest' in data:
        output = [{ "description":"[Experimental] This code snippet represents a REQUEST",
             "probability": 84.9
             },
             { "description":"[Experimental] This code snippet represents a return",
             "probability":0.9
             }]
    elif 'isPrime' in data:
        output = [{ "description":"[Experimental] This code snippet represents a PRIME",
             "probability":90.33
             },
             { "description":"[Experimental] This code snippet represents a FACTORIAL",
             "probability":1.99
             },
             { "description":"[Experimental] This code snippet represents a isPowerOf",
             "probability":2
             }]
    else:
        output = [{ "description":"[Experimental] Unable to predict. Still Learning.",
             "probability":0.1
             }]
    
    return output
    


def lambda_handler(event, context):
    print('calling lambda_handler')
    
    data = json.dumps(event)

    print(data)
    response = runtime.invoke_endpoint(EndpointName=MODEL_ENDPOINT,
                                   ContentType='application/json',
                                   Body=data)

    result = response['Body'].read().decode()
    
    jsonresult = json.loads(result)
    
    out = []
    for r in jsonresult['output']:
        out.append(beautify_pycode(r))
        
    #print(out)
    out_cleaned = "\n".join(out)
    
    ast = parse_py_ast(out_cleaned)
    #ast = out_cleaned
    #print(ast)
    
    return {
        'statusCode': 200,
        'output': out_cleaned,
        'ast': ast,
        'summary':get_summary_sample(data)
    }