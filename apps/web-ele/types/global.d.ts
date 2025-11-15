declare global {
  declare type ElTagType = 'danger' | 'info' | 'primary' | 'success' | 'warning';
  /**
   * 字典数据  数据配置
   */
  declare interface DictDataOption {
    label: string;
    value: string;
    elTagType?: ElTagType;
    elTagClass?: string;
  }
}
export {};
