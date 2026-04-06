// eslint-disable-next-line import/no-anonymous-default-export
export default [
  {
    projectName: 'user',
    namespace: 'UserAPI',
    requestLibPath: "import { request } from '@/services/request'",
    schemaPath: 'http://localhost:8081/api/v3/api-docs',
    serversPath: './src/api',
  },
  {
    projectName: 'file',
    namespace: 'FileAPI',
    requestLibPath: "import { request } from '@/services/request'",
    schemaPath: 'http://localhost:8082/api/v3/api-docs',
    serversPath: './src/api',
  },
  {
    projectName: 'notification',
    namespace: 'NotificationAPI',
    requestLibPath: "import { request } from '@/services/request'",
    schemaPath: 'http://localhost:8083/api/v3/api-docs',
    serversPath: './src/api',
  },
  {
    projectName: 'log',
    namespace: 'LogAPI',
    requestLibPath: "import { request } from '@/services/request'",
    schemaPath: 'http://localhost:8084/api/v3/api-docs',
    serversPath: './src/api',
  },
  {
    projectName: 'ai',
    namespace: 'AiAPI',
    requestLibPath: "import { request } from '@/services/request'",
    schemaPath: 'http://localhost:8085/api/v3/api-docs',
    serversPath: './src/api',
  },
  {
    projectName: 'chat',
    namespace: 'ChatAPI',
    requestLibPath: "import { request } from '@/services/request'",
    schemaPath: 'http://localhost:8086/api/v3/api-docs',
    serversPath: './src/api',
  },
]
