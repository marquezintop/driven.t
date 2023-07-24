import { ApplicationError } from '@/protocols';

export function cannotListBokkingsError(): ApplicationError {
  return {
    name: 'CannotListBokkingsError',
    message: 'Cannot list Bokkings!',
  };
}
