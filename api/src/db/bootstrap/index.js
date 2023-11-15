const { muscleGroupDb } = require("../index");
const { MuscleGroups } = require("../schemas/MuscleGroup");
const { MuscleHighlights } = require("../schemas/muscleHighlight");
const { Muscles } = require("../schemas/Muscle");

const _types = [MuscleGroups, MuscleHighlights, Muscles];
const _names = ["MuscleGroup", "MuscleHighlight", "Muscle"];

/**
 * 
 * @param {Array} types array of mongoose types to be bootstrapped
 */
const bootstrap = async (types, names) => {
    for (let i = 0; i < types.length; i++) {
        let type = types[i];
        let name = names[i];
        console.log(`\nBootstrapping ${name}`);

        const Model = await muscleGroupDb.model(name);
        await Model.init();
        const count = await Model.count();
        if (count == 0) {
            for (let data of type) {
                await Model.create(data); 
                // const dataToSave = new Model(data);
                // await dataToSave.save();
            }
            console.log(`Created ${name}`);
        }

        else console.log(`Skipped ${name}`);
    }
    console.log("\n[Success] Done bootstrapping...");
    return;
};

(async () => {
    await bootstrap(_types, _names);
})();