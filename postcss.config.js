import pxtorom from '@minko-fe/postcss-pxtorem'

export default {
  plugins: [
    pxtorom({
      rootValue: 16,
      unitPrecision: 5,
      propList: ['*'],
      // selectorBlackList: [],
      // replace: true,
      // mediaQuery: false,
      // minPixelValue: 0,
      // exclude: /node_modules/i,
    }),
  ],
}
