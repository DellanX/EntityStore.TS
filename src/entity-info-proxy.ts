import { Entity } from './entity';
import { PropertyInfoProxy } from './property-info-proxy';

/**
 * Entity info proxy to provide property traversal without actual accessing an object.
 * 
 * @type {EntityInfoProxy<TEntity>}
 */
export type EntityInfoProxy<TEntity extends Entity> = {
    [TProperty in keyof TEntity]: PropertyInfoProxy<TEntity[TProperty]>;
};
