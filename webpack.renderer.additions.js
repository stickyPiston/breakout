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
      },
			{
				test: /\.json$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: 'database/[name].[ext]'		
						}
					}
				],
				type: 'javascript/auto',
			}
    ]
  }
}
