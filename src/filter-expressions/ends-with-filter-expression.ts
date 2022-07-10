import { FilterExpressionVisitor } from '../filter-expression-visitor';
import { PropertyInfo } from '../property-info';
import { PropertyFilterExpression } from './property-filter-expression';

/**
 * Ends with filter expression.
 * 
 * @type {EndsWithFilterExpression}
 */
export class EndsWithFilterExpression extends PropertyFilterExpression
{
    /**
     * Expression value.
     * 
     * @type {string}
     */
    public readonly value: string;

    /**
     * Constructor.
     * 
     * @param {PropertyInfo<string>} propertyInfo Property info attached to expression.
     * @param {string} value Expression value.
     */
    public constructor(propertyInfo: PropertyInfo<string>, value: string)
    {
        super(propertyInfo);
        
        this.value = value;

        return;
    }
    
    /**
     * Accepts a certain filter expression visitor.
     * 
     * @param {FilterExpressionVisitor<TResult>} filterExpressionVisitor Filter expression visitor which returns a concrete result.
     * 
     * @returns {TResult} Filter expression visitor result.
     */
    public accept<TResult>(filterExpressionVisitor: FilterExpressionVisitor<TResult>): TResult
    {
        return filterExpressionVisitor.visitEndsWithFilterExpression(this);
    }
}
