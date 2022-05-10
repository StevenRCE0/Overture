<script lang="ts">
    import type {
        NotionConnection,
        ChickenForm,
    } from "../Stuff/Chicken/chicken"
    import FormItem from "../Stuff/Chicken/FormItem.svelte"
    const notionConnection: NotionConnection = {
        token: "",
        database: "",
    }
    let formData: ChickenForm
</script>

<main>
    <div id="formContainer">
        <FormItem legend="Name">
            <input
                type="text"
                bind:value={formData.name}
            />
        </FormItem>
    </div>
</main>

<style>
    #formContainer {
        display: flex;
        flex-direction: row;
        margin: 5px auto 0 auto;
    }
</style>
