import {defineConfig} from 'vite'
import {resolve} from 'path'

export default defineConfig({
    resolve: {
        alias: {
            '@Math': resolve(__dirname, './src/UI/Math'),
            '@GameObjects': resolve(__dirname, './src/UI/GameObjects')
        }
    }
})