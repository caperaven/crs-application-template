import {ViewBase} from "./node_modules/crs-binding/crs-view-base.js";

export default class IndexViewModel extends ViewBase {
    async connectedCallback() {
        super.connectedCallback();
        this.routes = this._getRoutes();
    }

    _getRoutes() {
        const router = document.querySelector("crs-router");

        const fn = () => {
            router.removeEventListener("ready", fn);
            const routes = router.routesDef;
            console.log(routes);
        };

        router.addEventListener("ready", fn);
    }
}