import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "@rspack/cli";
import { rspack } from "@rspack/core";
import RefreshPlugin from "@rspack/plugin-react-refresh";
import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';

import packageJson from "./package.json" assert { type: "json" };

const deps = packageJson.dependencies || {};
console.log("dependencies", deps);

const __dirname = dirname(fileURLToPath(import.meta.url));
const isDev = process.env.NODE_ENV === "development";

// Target browsers, see: https://github.com/browserslist/browserslist
const targets = ["chrome >= 87", "edge >= 88", "firefox >= 78", "safari >= 14"];

export default defineConfig({
	context: __dirname,
	mode: isDev ? "development" : "production",
	entry: {
		main: "./src/main.jsx"
	},
	target: "web",
  output: {
    filename: "[name].[contenthash].js",
    uniqueName: 'rspack_remote',
    publicPath: 'auto',
		clean: true
  },
	resolve: {
		extensions: ["...", ".ts", ".tsx", ".jsx"]
	},
	module: {
		rules: [
			{
				test: /\.svg$/,
				type: "asset"
			},
			{
				test: /\.(jsx?|tsx?)$/,
				use: [
					{
						loader: "builtin:swc-loader",
						options: {
							jsc: {
								parser: {
									syntax: "typescript",
									tsx: true
								},
								transform: {
									react: {
										runtime: "automatic",
										development: isDev,
										refresh: isDev
									}
								}
							},
							env: { targets }
						}
					}
				]
			}
		]
	},
	plugins: [
		new rspack.HtmlRspackPlugin({
			template: "./index.html"
		}),
		isDev ? new RefreshPlugin() : null,

    new ModuleFederationPlugin({
			name: "rspack_remote",
			filename: "remoteEntry.js",
			library: { type: "var", name: "rspack_remote" },
			exposes: {
				'./Button': './src/components/Button/Index.jsx'
			},
			shared: {
				react: { singleton: true, eager: true, requiredVersion: deps.react,  },
				"react-dom": { singleton: true, eager: true, requiredVersion: deps["react-dom"] }
			}
    }),
	].filter(Boolean),
	optimization: {
		minimizer: [
			new rspack.SwcJsMinimizerRspackPlugin(),
			new rspack.LightningCssMinimizerRspackPlugin({
				minimizerOptions: { targets }
			})
		]
	},
	experiments: {
		css: true
	}
});
