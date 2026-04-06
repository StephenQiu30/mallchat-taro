import path from 'path';
import tailwindcss from "@tailwindcss/postcss";
import { UnifiedViteWeappTailwindcssPlugin } from "weapp-tailwindcss/vite";
import { defineConfig, type UserConfigExport } from '@tarojs/cli';
import devConfig from './dev';
import prodConfig from './prod';


// https://taro-docs.jd.com/docs/next/config#defineconfig-辅助函数
process.env.BROWSERSLIST_ENV = process.env.NODE_ENV
export default defineConfig<'vite'>(async (merge) => {

  const baseConfig: UserConfigExport<'vite'> = {
    projectName: 'mallchat-taro',
    date: '2026-4-6',
    designWidth: 750,
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      375: 2,
      828: 1.81 / 2
    },
    sourceRoot: 'src',
    outputRoot: 'dist',
    plugins: ["@tarojs/plugin-generator"],
    defineConstants: {},
    copy: {
      patterns: [],
      options: {}
    },
    framework: 'react',
    compiler: {
      type: "vite",
      vitePlugins: [{
        name: 'postcss-config-loader-plugin',
        config(config) {
          // 加载 tailwindcss
          if (typeof config.css?.postcss === 'object') {
            config.css?.postcss.plugins?.unshift(tailwindcss());
          }
        }
      }, UnifiedViteWeappTailwindcssPlugin({
        // rem转rpx
        rem2rpx: true,
        // 除了小程序这些，其他平台都 disable
        disabled: process.env.TARO_ENV === 'h5' || process.env.TARO_ENV === 'harmony' || process.env.TARO_ENV === 'rn',
        // 由于 taro vite 默认会移除所有的 tailwindcss css 变量，所以一定要开启这个配置，进行css 变量的重新注入
        injectAdditionalCssVarScope: true,
        // @ts-ignore
        cssEntries: [path.resolve(__dirname, '../src/tailwind.css')]
      })]

    },
    mini: {
      postcss: {
        pxtransform: {
          enable: true,
          config: {}
        },
        cssModules: {
          enable: false,
          // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module',
            // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      }
    },
    h5: {
      publicPath: '/',
      staticDirectory: 'static',
      miniCssExtractPluginOption: {
        ignoreOrder: true,
        filename: 'css/[name].[hash].css',
        chunkFilename: 'css/[name].[chunkhash].css'
      },
      postcss: {
        autoprefixer: {
          enable: true,
          config: {}
        },
        cssModules: {
          enable: false,
          // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module',
            // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      },
      legacy: true
    },
    rn: {
      appName: 'taroDemo',
      postcss: {
        cssModules: {
          enable: false // 默认为 false，如需使用 css modules 功能，则设为 true
        }
      }
    }
  };
  if (process.env.NODE_ENV === 'development') {
    // 本地开发构建配置（不混淆压缩）
    return merge({}, baseConfig, devConfig);
  }
  // 生产构建配置（默认开启压缩混淆等）
  return merge({}, baseConfig, prodConfig);
});