import isArray from 'lodash/isArray';
import isFunction from 'lodash/isFunction';
import isNull from 'lodash/isNull';
import isUndefined from 'lodash/isUndefined';
import { Serializer, SerializerContext, TypeCtor, TypeLike } from '@dipscope/type-manager';
import { EntityCollection } from './entity-collection';
import { isEntityCollection } from './functions/is-entity-collection';

/**
 * Entity collection serializer.
 *
 * @type {EntityCollectionSerializer}
 */
export class EntityCollectionSerializer implements Serializer<EntityCollection<any>>
{
    /**
     * Serializes provided value.
     *
     * @param {TypeLike<EntityCollection<any>>} x Some value.
     * @param {SerializerContext<EntityCollection<any>>} serializerContext Serializer context.
     *
     * @returns {TypeLike<any>} Serialized value or undefined.
     */
    public serialize(x: TypeLike<EntityCollection<any>>, serializerContext: SerializerContext<EntityCollection<any>>): TypeLike<any>
    {
        if (isUndefined(x))
        {
            return serializerContext.serializedDefaultValue;
        }

        if (isNull(x))
        {
            return x;
        }

        if (isEntityCollection(x))
        {
            return serializerContext.defineReference(x, () =>
            {
                const arrayInput = x.toArray();
                const arrayOutput = new Array<any>();
                const genericSerializerContext = serializerContext.defineGenericSerializerContext(0);

                for (let i = 0; i < arrayInput.length; i++)
                {
                    const valueSerializerContext = genericSerializerContext.defineChildSerializerContext({
                        path: `${genericSerializerContext.path}[${i}]`
                    });

                    const value = valueSerializerContext.serialize(arrayInput[i]);

                    if (isFunction(value))
                    {
                        genericSerializerContext.pushReferenceCallback(arrayInput[i], () =>
                        {
                            arrayOutput[i] = value();
                        });

                        continue;
                    }

                    arrayOutput[i] = value;
                }

                return arrayOutput;
            });
        }

        if (serializerContext.log.errorEnabled)
        {
            serializerContext.log.error(`${serializerContext.path}: cannot serialize value as entity collection.`, x);
        }

        return undefined;
    }

    /**
     * Deserializes provided value.
     *
     * @param {TypeLike<any>} x Some value.
     * @param {SerializerContext<EntityCollection<any>>} serializerContext Serializer context.
     *
     * @returns {TypeLike<EntityCollection<any>>} Deserialized value.
     */
    public deserialize(x: TypeLike<any>, serializerContext: SerializerContext<EntityCollection<any>>): TypeLike<EntityCollection<any>>
    {
        if (isUndefined(x))
        {
            return serializerContext.deserializedDefaultValue;
        }

        if (isNull(x))
        {
            return x;
        }

        if (isArray(x))
        {
            return serializerContext.restoreReference(x, () =>
            {
                const arrayInput = x;
                const arrayOutput = new Array<any>();
                const genericSerializerContext = serializerContext.defineGenericSerializerContext(0);
                const entityCollectionCtor = serializerContext.typeMetadata.typeFn as TypeCtor<EntityCollection<any>>;

                for (let i = 0; i < arrayInput.length; i++)
                {
                    const valueSerializerContext = genericSerializerContext.defineChildSerializerContext({
                        path: `${genericSerializerContext.path}[${i}]`
                    });

                    const value = valueSerializerContext.deserialize(arrayInput[i]);

                    if (isFunction(value))
                    {
                        genericSerializerContext.pushReferenceCallback(arrayInput[i], () =>
                        {
                            arrayOutput[i] = value();
                        });

                        continue;
                    }

                    arrayOutput[i] = value;
                }

                return new entityCollectionCtor(arrayOutput);
            });
        }

        if (serializerContext.log.errorEnabled)
        {
            serializerContext.log.error(`${serializerContext.path}: cannot deserialize value as entity collection.`, x);
        }

        return undefined;
    }
}
