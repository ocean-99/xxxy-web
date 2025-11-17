import { mitt } from '@vben/utils';

type Events = {
  flowMainEditClose: void;
};

export const emitter = mitt<Events>();
