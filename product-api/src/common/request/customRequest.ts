import { UserPayload } from './payload';

export interface CustomRequest extends Request {
  user?: UserPayload;
}
