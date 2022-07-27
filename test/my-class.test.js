import { assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import { afterEach, beforeEach, describe, it} from "https://deno.land/std@0.149.0/testing/bdd.ts";
import {MyClass} from "./../src/my-class.js";

describe("my class tests", async () => {
    let instance;

    beforeEach(() => {
        instance = new MyClass();
    })

    afterEach(() => {
        instance.dispose();
    })

    it("my-class - constructed", async () => {
        assert(instance != null);
    })
})