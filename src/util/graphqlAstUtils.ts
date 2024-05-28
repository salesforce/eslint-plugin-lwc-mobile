import { Position } from 'estree';
import { AST } from 'eslint';
import { GraphQLESTreeNode } from '../rules/graphql/types';
import { FieldNode, Kind, DocumentNode, OperationDefinitionNode } from 'graphql';
import { DEFAULT_PAGE_SIZE } from '../rules/graphql/EntityStats';

export type GraphQLESFieldNode = GraphQLESTreeNode<FieldNode>;

export function getLocation(start: Position, fieldName = ''): AST.SourceLocation {
    const { line, column } = start;
    return {
        start: {
            line,
            column
        },
        end: {
            line,
            column: column + fieldName.length
        }
    };
}

/**
 * Find closest ancestor by type
 */
export function getClosestAncestorByType(
    node: GraphQLESFieldNode,
    type: Kind
): GraphQLESFieldNode | undefined {
    let parentNode: any = node.parent;
    while (parentNode !== undefined && parentNode.type !== type) {
        parentNode = parentNode.parent;
    }
    return parentNode;
}

/**
 * Get the entity node for specified edges node. 
 * For example, return ServiceResource node edges node
    query {
      ServiceResource(first: 2 where: {Id: {eq:$id}}) {
        edges {
    ...
 * @param edgesNode 
 * @returns 
 */
export function getEntityNodeForEdges(
    edgesNode: GraphQLESFieldNode
): GraphQLESFieldNode | undefined {
    return edgesNode.parent?.parent?.type === Kind.FIELD
        ? (edgesNode.parent.parent as GraphQLESFieldNode)
        : undefined;
}

/**
 * Get the page size for an entity by pulling value of 'first' argument from the entity node. if 'first' is not specified, use the default value
 * For example get 3 for ' ServiceAppointments(first: 3) { ... } '
 * @param node the entity field node
 * @returns the page size value
 */
export function getPageSizeFromEntityNode(node: GraphQLESFieldNode): number {
    if (node.arguments?.length === 0) {
        return DEFAULT_PAGE_SIZE;
    }

    const firstArgument = node.arguments
        ?.filter((arg) => {
            return arg.name.value === 'first';
        })
        .pop();

    if (firstArgument === undefined || firstArgument.value.kind != Kind.INT) {
        return DEFAULT_PAGE_SIZE;
    }

    return Number.parseInt(firstArgument.value.value);
}

/**
 * Get the parent entity node by walking up the parent tree from the specified entity node, return 
 * undefined if the specified entity node is already root entity. Current graphql only supports one 
 * level child relation query, so no need to support find ancestors yet. 
 *   
 * For example: get parent ServiceResource for ServiceAppointments entity node
 * query {
      ServiceResource {
        edges {
          node {
            Id
            ServiceAppointments {
              edges {
                node { 
                  Id
    ...
 * @param entityNode the parent entity node
 */
export function getParentEntityNode(
    entityNode: GraphQLESFieldNode
): GraphQLESFieldNode | undefined {
    const node = getClosestAncestorByType(entityNode, Kind.FIELD);
    if (node === undefined || node.name.value !== 'node') {
        return undefined;
    }
    const edges = getClosestAncestorByType(node, Kind.FIELD);
    if (edges == undefined || edges.name.value !== 'edges') {
        return undefined;
    }
    return getEntityNodeForEdges(edges);
}

/**
 * Get the operation index of specified entityNode is under due to Graphql document could has multiple operations.
 * Returned result could be undefined if the query is not valid.
 *  
 * For example, return 0 if ServiceResource entity node is specified or 1 if Contact is specified. 
 query getServiceResource($id: ID) {
  uiapi {
    query {
      ServiceResource {
 
  ...
 }
 query getContacts($id: ID) {
  uiapi {
    query {
      Contact(where: {Id: {eq:$id}}) {
 ...
 }
 */
export function getOperationIndex(entityNode: GraphQLESFieldNode): number {
    const operation = getClosestAncestorByType(entityNode, Kind.OPERATION_DEFINITION)!;
    const document = operation.parent.rawNode() as any as DocumentNode;
    return document.definitions.indexOf(operation.rawNode() as any as OperationDefinitionNode);
}
