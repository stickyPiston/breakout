module.exports = {
  module: {
    rules: [
      {
        test: /\.wav$/,
        use: [
					{
						loader: 'file-loader',
						options: {
      		  	name: 'res/sound/[name].[ext]',
        		}
					}
				]
      }
    ]
  }
}
