import * as resolverModule from '@forge/resolver';
import { renderDot } from './render';

// The package is an ES module; @forge/resolver is CommonJS, so its class can sit one or two "default"s deep.
const Resolver = resolverModule.default?.default || resolverModule.default || resolverModule;
const resolver = new Resolver();
resolver.define('render', ({ payload }) => renderDot(payload && payload.dot));
export const handler = resolver.getDefinitions();
