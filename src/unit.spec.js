/**
 * @jest-environment jsdom
 */

import Eclipse from "./Transitions/Eclipse.svelte";
import {render} from "@testing-library/svelte";

it("Eclipse", async () => {
    render(Eclipse)
})
