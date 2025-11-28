// vite.config.js
import { defineConfig } from "file:///C:/Repositorios/SPA-Elixir/Desarrollo/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Repositorios/SPA-Elixir/Desarrollo/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { resolve } from "path";
import fs from "fs/promises";
import svgr from "file:///C:/Repositorios/SPA-Elixir/Desarrollo/node_modules/@svgr/rollup/dist/index.js";
var __vite_injected_original_dirname = "C:\\Repositorios\\SPA-Elixir\\Desarrollo";
var vite_config_default = defineConfig({
  resolve: {
    alias: {
      src: resolve(__vite_injected_original_dirname, "src")
    }
  },
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.jsx?$/,
    exclude: []
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx"
      },
      plugins: [
        {
          name: "load-js-files-as-jsx",
          setup(build) {
            build.onLoad(
              { filter: /src\\.*\.js$/ },
              async (args) => ({
                loader: "jsx",
                contents: await fs.readFile(args.path, "utf8")
              })
            );
          }
        }
      ]
    }
  },
  // plugins: [react(),svgr({
  //   exportAsDefault: true
  // })],
  plugins: [svgr(), react()]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxSZXBvc2l0b3Jpb3NcXFxcU1BBLUVsaXhpclxcXFxEZXNhcnJvbGxvXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxSZXBvc2l0b3Jpb3NcXFxcU1BBLUVsaXhpclxcXFxEZXNhcnJvbGxvXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9SZXBvc2l0b3Jpb3MvU1BBLUVsaXhpci9EZXNhcnJvbGxvL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XHJcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJztcclxuaW1wb3J0IGZzIGZyb20gJ2ZzL3Byb21pc2VzJztcclxuaW1wb3J0IHN2Z3IgZnJvbSAnQHN2Z3Ivcm9sbHVwJztcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgYWxpYXM6IHtcclxuICAgICAgICAgICAgc3JjOiByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycpLFxyXG4gICAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgZXNidWlsZDoge1xyXG4gICAgICAgIGxvYWRlcjogJ2pzeCcsXHJcbiAgICAgICAgaW5jbHVkZTogL3NyY1xcLy4qXFwuanN4PyQvLFxyXG4gICAgICAgIGV4Y2x1ZGU6IFtdLFxyXG4gICAgfSxcclxuICAgIG9wdGltaXplRGVwczoge1xyXG4gICAgICAgIGVzYnVpbGRPcHRpb25zOiB7XHJcbiAgICAgICAgICAgIGxvYWRlcjoge1xyXG4gICAgICAgICAgICAgICAgJy5qcyc6ICdqc3gnLFxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHBsdWdpbnM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnbG9hZC1qcy1maWxlcy1hcy1qc3gnLFxyXG4gICAgICAgICAgICAgICAgICAgIHNldHVwKGJ1aWxkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1aWxkLm9uTG9hZChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgZmlsdGVyOiAvc3JjXFxcXC4qXFwuanMkLyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXN5bmMgKGFyZ3MpID0+ICh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9hZGVyOiAnanN4JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50czogYXdhaXQgZnMucmVhZEZpbGUoYXJncy5wYXRoLCAndXRmOCcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICB9LFxyXG4gICAgfSxcclxuXHJcblxyXG4gICAgXHJcbiAgICAvLyBwbHVnaW5zOiBbcmVhY3QoKSxzdmdyKHtcclxuICAgIC8vICAgZXhwb3J0QXNEZWZhdWx0OiB0cnVlXHJcbiAgICAvLyB9KV0sXHJcblxyXG4gICAgcGx1Z2luczogW3N2Z3IoKSwgcmVhY3QoKV0sXHJcbn0pOyJdLAogICJtYXBwaW5ncyI6ICI7QUFBeVMsU0FBUyxvQkFBb0I7QUFDdFUsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsZUFBZTtBQUN4QixPQUFPLFFBQVE7QUFDZixPQUFPLFVBQVU7QUFKakIsSUFBTSxtQ0FBbUM7QUFPekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDeEIsU0FBUztBQUFBLElBQ0wsT0FBTztBQUFBLE1BQ0gsS0FBSyxRQUFRLGtDQUFXLEtBQUs7QUFBQSxJQUNqQztBQUFBLEVBQ0o7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNMLFFBQVE7QUFBQSxJQUNSLFNBQVM7QUFBQSxJQUNULFNBQVMsQ0FBQztBQUFBLEVBQ2Q7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNWLGdCQUFnQjtBQUFBLE1BQ1osUUFBUTtBQUFBLFFBQ0osT0FBTztBQUFBLE1BQ1Q7QUFBQSxNQUNGLFNBQVM7QUFBQSxRQUNMO0FBQUEsVUFDSSxNQUFNO0FBQUEsVUFDTixNQUFNLE9BQU87QUFDVCxrQkFBTTtBQUFBLGNBQ0YsRUFBRSxRQUFRLGVBQWU7QUFBQSxjQUN6QixPQUFPLFVBQVU7QUFBQSxnQkFDYixRQUFRO0FBQUEsZ0JBQ1IsVUFBVSxNQUFNLEdBQUcsU0FBUyxLQUFLLE1BQU0sTUFBTTtBQUFBLGNBQ2pEO0FBQUEsWUFDSjtBQUFBLFVBQ0o7QUFBQSxRQUNKO0FBQUEsTUFDSjtBQUFBLElBQ0o7QUFBQSxFQUNKO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFRQSxTQUFTLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQztBQUM3QixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
