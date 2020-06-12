import {ViewBase} from "./node_modules/crs-binding/crs-view-base.js";

export default class IndexViewModel extends ViewBase {
    async connectedCallback() {
        super.connectedCallback();
        this.routes = this._getRoutes();
    }

    _getRoutes() {
        const router = document.querySelector("crs-router");
        const result = [];
        const fn = () => {
            router.removeEventListener("ready", fn);

            const routes = router.routesDef;
            for (let route of routes.routes) {
                if (route.hash != "#404") {
                    result.push({title: route.title, hash: route.hash});
                }
            }
            crsbinding.data.setProperty(this, "routes", result);
        };

        router.addEventListener("ready", fn);
    }
}