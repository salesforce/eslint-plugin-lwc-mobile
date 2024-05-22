import { Position } from 'estree';
import { AST } from 'eslint';

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
