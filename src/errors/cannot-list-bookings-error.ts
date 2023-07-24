import { ApplicationError } from '@/protocols';

export function cannotListBokingsError(): ApplicationError {
  return {
    name: 'CannotListBokingsError',
    message: 'Cannot list Bokings!',
  };
}
