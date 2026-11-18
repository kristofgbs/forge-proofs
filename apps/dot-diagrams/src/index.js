import Resolver from '@forge/resolver';
import { renderDot } from './render';

const resolver = new Resolver();
resolver.define('render', ({ payload }) => renderDot(payload && payload.dot));
export const handler = resolver.getDefinitions();
