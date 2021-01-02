export interface ITreeNode {
    name?: string,
    active?: boolean,
    converted?: boolean,
    data?: any,
    childs?: ITreeNode[]
}