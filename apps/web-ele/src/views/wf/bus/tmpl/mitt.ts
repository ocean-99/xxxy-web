import { mitt } from '@vben/utils';

type Events = {
  flowTmplEditClose: void;
};

export const emitter = mitt<Events>();
