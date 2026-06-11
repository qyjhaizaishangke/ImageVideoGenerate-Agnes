import type { ParentComponent } from "solid-js";
import Menu from "./components/Menu";

const Layout: ParentComponent = (props) => {
  return (
    <div class="flex h-screen">
      <Menu />
      <main class="flex-1 overflow-auto bg-surface">
        {props.children}
      </main>
    </div>
  );
};

export default Layout;
