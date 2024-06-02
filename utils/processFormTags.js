const Tag = require("../models/tag")

async function processFormTags(tags){
    const all_db_tags = await Tag.find().exec(); //all tas
    const db_tag_names = await all_db_tags.map(a=>a.name);
    const db_tag_id = await all_db_tags.map(a=>a._id);

    const ids = [] //for creating new article document
    const added = []

    for (const form_tag of tags){
        if (!added.includes(form_tag)){
            const index = db_tag_names.indexOf(form_tag) //check if tag exists in db
            if (index==-1){ //tag does not exist in db
                const new_tag = new Tag({
                    name:form_tag
                })
                await new_tag.save();
                ids.push(new_tag._id)
                added.push(form_tag)
            }
            else{
                ids.push(db_tag_id[index]) //add the corresponding id of the tag to the DB
                added.push(form_tag)
            }
        }
    }
    return ids;
}


module.exports = processFormTags