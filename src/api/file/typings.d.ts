declare namespace FileAPI {
  type BaseResponseFileVO = {
    /** 状态码 */
    code?: number;
    data?: FileVO;
    /** 消息 */
    message?: string;
  };

  type FileVO = {
    /** 文件访问链接 */
    url?: string;
    /** 文件对象Key */
    key?: string;
    /** 文件名 */
    fileName?: string;
    /** 文件大小 (bytes) */
    size?: number;
  };

  type uploadFileParams = {
    bizType: string;
  };
}
