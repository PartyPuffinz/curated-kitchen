import { Link } from 'react-router-dom'
import './FAQ.css'

const diets = [
  {
    name: 'Keto',
    type: 'Diet',
    description: `The ketogenic diet is a high-fat, very low-carbohydrate diet designed to put your body into a metabolic state called ketosis. In ketosis, your body burns fat for fuel instead of carbohydrates.

The general target is to stay under 20 grams of net carbs per day. Net carbs are calculated by subtracting dietary fiber from total carbohydrates — so a food with 8g carbs and 5g fiber has only 3g net carbs. Fat typically makes up 70–80% of daily calories, protein 15–25%, and carbs under 5%.

Foods commonly avoided: bread, pasta, rice, potatoes, corn, sugar, honey, most fruits, and starchy vegetables. Foods commonly eaten: meat, fish, eggs, cheese, butter, oils, leafy greens, and low-carb vegetables.`
  },
  {
    name: 'Paleo',
    type: 'Diet',
    description: `The Paleolithic diet, or "caveman diet," focuses on eating foods that would have been available to our prehistoric ancestors. The idea is to avoid processed foods, grains, legumes, and dairy — foods that became common after the agricultural revolution.

Foods commonly eaten: meat, fish, eggs, vegetables, fruits, nuts, seeds, and healthy oils. Foods avoided: grains, legumes (including peanuts), dairy, refined sugar, salt, potatoes, and processed foods.

Paleo is naturally gluten-free and dairy-free, though it is not designed specifically for those allergies.`
  },
  {
    name: 'Mediterranean',
    type: 'Diet',
    description: `The Mediterranean diet is inspired by the traditional eating patterns of countries bordering the Mediterranean Sea, particularly Greece, Italy, and Spain. It is widely regarded as one of the healthiest and most sustainable diets.

It emphasizes plant-based foods, whole grains, legumes, nuts, and olive oil as the primary fat source. Fish and seafood are eaten frequently, poultry and eggs in moderation, and red meat rarely. Dairy is consumed in moderate amounts, primarily as cheese and yogurt.

The Mediterranean diet is associated with reduced risk of heart disease, stroke, and certain cancers.`
  },
  {
    name: 'Vegan',
    type: 'Diet & Lifestyle',
    description: `Veganism eliminates all animal products — not just meat, but also dairy, eggs, honey, gelatin, and any other ingredient derived from animals. It is often motivated by a combination of ethical, environmental, and health reasons.

A well-planned vegan diet can meet all nutritional needs, though attention to vitamin B12, iron, calcium, omega-3 fatty acids, and vitamin D is important. Common protein sources include legumes, tofu, tempeh, seitan, and whole grains.

Note: Vegan recipes are also vegetarian, but vegetarian recipes are not always vegan.`
  },
  {
    name: 'Vegetarian',
    type: 'Diet',
    description: `Vegetarianism excludes meat, poultry, and seafood but typically allows eggs and dairy products (this is also called lacto-ovo vegetarian). Some vegetarians exclude eggs or dairy individually.

Vegetarian diets are associated with lower rates of heart disease, type 2 diabetes, and certain cancers when well-planned. Common protein sources include legumes, eggs, dairy, tofu, tempeh, and whole grains.`
  },
  {
    name: 'Halal',
    type: 'Religious Dietary Law',
    description: `Halal is an Arabic word meaning "permissible" and refers to food that is lawful under Islamic dietary law. Halal requirements cover not just what is eaten but how animals are slaughtered and prepared.

Foods prohibited (haram) include pork and pork by-products, alcohol, blood, and animals not slaughtered according to Islamic law. All fruits, vegetables, grains, and legumes are generally considered halal. Seafood is generally permissible.

When cooking for someone who eats halal, it is important to ensure that all meat is certified halal and that no cross-contamination with prohibited ingredients occurs.`
  },
  {
    name: 'Kosher',
    type: 'Religious Dietary Law',
    description: `Kosher refers to food that conforms to Jewish dietary law (kashrut). The rules are detailed and cover which animals may be eaten, how they must be slaughtered, how food must be prepared, and how different food types may be combined.

Key rules include: pork and shellfish are prohibited; meat and dairy may not be eaten together or cooked in the same vessels; only animals with split hooves that chew their cud are permitted; and fish must have fins and scales.

Kosher certification on a product indicates it has been prepared according to these standards.`
  },
  {
    name: 'Low-carb',
    type: 'Diet',
    description: `A low-carbohydrate diet reduces carbohydrate intake relative to a typical diet, generally staying under 100–150 grams of net carbs per day. It is less restrictive than Keto but still limits bread, pasta, rice, sugar, and starchy vegetables.

Low-carb diets are commonly used for weight management, blood sugar control, and reducing triglycerides. Unlike Keto, the goal is not necessarily to reach ketosis — simply to reduce carbohydrate intake.`
  },
  {
    name: 'Low-sodium',
    type: 'Diet',
    description: `A low-sodium diet limits daily sodium intake, typically to under 1,500–2,000 milligrams per day (the average American consumes over 3,400mg daily). It is commonly recommended for people with high blood pressure, heart disease, kidney disease, or fluid retention.

Foods high in sodium to avoid: processed foods, canned soups, deli meats, fast food, soy sauce, and most restaurant meals. Cooking from scratch with fresh ingredients and using herbs and spices instead of salt is the most effective way to reduce sodium.`
  },
  {
    name: 'DASH',
    type: 'Diet',
    description: `DASH stands for Dietary Approaches to Stop Hypertension. It was developed specifically to lower blood pressure and is consistently ranked among the healthiest diets by nutrition experts.

DASH emphasizes fruits, vegetables, whole grains, lean protein, and low-fat dairy while limiting sodium, saturated fat, red meat, sweets, and sugary beverages. It does not eliminate any food group but focuses on balance and moderation.

Unlike Low-sodium, DASH is a comprehensive eating pattern rather than a single restriction.`
  },
  {
    name: 'Whole30',
    type: 'Elimination Diet',
    description: `Whole30 is a strict 30-day elimination diet designed to reset your relationship with food and identify potential food sensitivities. For 30 days, you eliminate grains, dairy, legumes, sugar (including honey and maple syrup), alcohol, and processed foods entirely.

After 30 days, eliminated foods are slowly reintroduced one at a time while monitoring how your body responds. Whole30 is not intended as a permanent diet but as a diagnostic tool and reset.

Foods allowed: meat, seafood, eggs, vegetables, fruits, and healthy fats like olive oil, coconut oil, and nuts (excluding peanuts, which are legumes).`
  },
  {
    name: 'AIP',
    type: 'Elimination Diet',
    description: `AIP stands for Autoimmune Protocol. It is a stricter version of the Paleo diet designed specifically for people with autoimmune conditions such as rheumatoid arthritis, lupus, inflammatory bowel disease, Hashimoto's thyroiditis, and others.

The elimination phase removes grains, legumes, dairy, eggs, nightshades (tomatoes, peppers, eggplant, potatoes), nuts, seeds, alcohol, coffee, and all processed foods. After the elimination phase, foods are slowly reintroduced to identify triggers.

AIP is one of the most restrictive diets and is typically undertaken with guidance from a healthcare provider.`
  },
  {
    name: 'Gluten-free',
    type: 'Allergy / Intolerance',
    description: `A gluten-free diet eliminates gluten, a protein found in wheat, barley, rye, and their derivatives. It is medically necessary for people with celiac disease (an autoimmune condition) and is also followed by people with non-celiac gluten sensitivity.

Common gluten-containing foods: bread, pasta, crackers, cereals, beer, soy sauce, and many processed foods. Naturally gluten-free foods: meat, fish, eggs, dairy, fruits, vegetables, rice, corn, quinoa, and potatoes.

Cross-contamination is a serious concern for people with celiac disease — even trace amounts of gluten can trigger a reaction.`
  },
  {
    name: 'Dairy-free',
    type: 'Allergy / Intolerance',
    description: `A dairy-free diet eliminates all products derived from animal milk, including milk, butter, cheese, cream, yogurt, ice cream, whey, and casein. It is necessary for people with a dairy allergy and common among people with lactose intolerance.

Dairy allergies involve an immune response to milk proteins (casein or whey) and can cause serious reactions. Lactose intolerance is a digestive issue involving difficulty processing lactose (milk sugar) and is generally less severe.

Many plant-based milks (oat, almond, soy, coconut) and dairy-free cheeses and butters are widely available as substitutes.`
  },
  {
    name: 'Egg-free',
    type: 'Allergy',
    description: `An egg-free diet eliminates eggs and egg-derived ingredients such as mayonnaise, meringue, albumin, and many baked goods. Egg allergy is one of the most common food allergies, particularly in children, though many outgrow it.

Eggs appear in many unexpected products including pasta, breaded foods, some candies, and certain vaccines. Reading ingredient labels carefully is essential. Common egg substitutes in baking include flaxseed meal mixed with water, applesauce, or commercial egg replacers.`
  },
  {
    name: 'Nut-free',
    type: 'Allergy',
    description: `A nut-free diet eliminates tree nuts, which include almonds, walnuts, cashews, pecans, pistachios, hazelnuts, macadamia nuts, brazil nuts, pine nuts, and chestnuts. Tree nut allergies are among the most common and most severe food allergies and can cause anaphylaxis.

Note: Peanuts are legumes, not tree nuts, and are covered separately under Peanut-free. However, many people with tree nut allergies also have peanut allergies, and cross-contamination is common in facilities that process both.`
  },
  {
    name: 'Peanut-free',
    type: 'Allergy',
    description: `Peanut allergy is one of the most common and potentially life-threatening food allergies. Even trace amounts can trigger anaphylaxis in highly sensitive individuals. Peanuts are legumes, not tree nuts, and are found in many unexpected products including certain sauces, candies, and Asian dishes.

Cross-contamination is a major concern — many products are manufactured in facilities that also process peanuts. People with severe peanut allergies should look for products labeled "peanut-free" and manufactured in dedicated peanut-free facilities.`
  },
  {
    name: 'Soy-free',
    type: 'Allergy / Intolerance',
    description: `A soy-free diet eliminates soybeans and soy-derived ingredients including tofu, edamame, miso, tempeh, soy sauce, tamari, and soybean oil. Soy allergy is one of the top eight food allergens and is particularly common in infants and young children.

Soy is found in many processed foods, making label reading essential. Some people with soy allergies can tolerate highly refined soy oil or soy lecithin — consult a healthcare provider for individual guidance.`
  },
  {
    name: 'Shellfish-free',
    type: 'Allergy',
    description: `A shellfish-free diet eliminates crustaceans and mollusks, including shrimp, crab, lobster, crayfish, prawns, scallops, clams, oysters, mussels, squid, and octopus. Shellfish allergy is one of the most common adult food allergies and is often lifelong.

Shellfish allergy is separate from fish allergy — someone may be allergic to one but not the other. Cross-contamination in seafood restaurants and processing facilities is a significant concern.`
  },
  {
    name: 'Fish-free',
    type: 'Allergy',
    description: `A fish-free diet eliminates all finfish including salmon, tuna, cod, tilapia, halibut, bass, trout, catfish, mahi-mahi, anchovies, and sardines, as well as fish-derived ingredients like fish sauce and Worcestershire sauce (which often contains anchovies).

Fish allergy is distinct from shellfish allergy. It is one of the top allergens and can cause severe reactions. Fish is often hidden in unexpected places — always check labels on sauces, broths, and condiments.`
  },
  {
    name: 'Sesame-free',
    type: 'Allergy',
    description: `Sesame allergy has become one of the top nine food allergens recognized in the United States. A sesame-free diet eliminates sesame seeds, sesame oil, tahini, and products containing sesame. It is commonly found in Middle Eastern, Asian, and Mediterranean cuisines.

Sesame can be hidden in bread, crackers, hummus, sauces, and various processed foods. As of 2023, sesame is required to be listed on food labels in the United States.`
  },
  {
    name: 'Chocolate-free',
    type: 'Allergy / Sensitivity',
    description: `While a true chocolate allergy is relatively rare, sensitivity to chocolate, cocoa, or cacao is more common and can cause reactions ranging from migraines and skin rashes to digestive issues. Some people react to the theobromine in chocolate, others to the caffeine, milk, or soy often found in chocolate products.

A chocolate-free diet eliminates chocolate, cocoa powder, cacao nibs, and products containing them such as Nutella, many desserts, and some beverages. Carob is a common chocolate substitute for those who cannot tolerate chocolate.`
  }
]

function Diets() {
  return (
    <main className="main">
      <div className="faq-layout">
        <div className="faq-header">
          <h2>Diets & Allergens Guide</h2>
          <p>A reference guide to the dietary tags used on
          Curated Kitchen — what they mean, who they're for,
          and what to watch out for.</p>
        </div>

        <div className="faq-section">
          <h3 className="faq-section-title">Diets</h3>
          {diets.filter(d => d.type !== 'Allergy' &&
            d.type !== 'Allergy / Intolerance' &&
            d.type !== 'Allergy / Sensitivity').map(diet => (
            <div key={diet.name} className="faq-item">
              <h4 className="faq-question">{diet.name}
                <span className="diet-type-tag">{diet.type}</span>
              </h4>
              <div className="faq-answer">
                {diet.description.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="faq-section">
          <h3 className="faq-section-title">Allergies & Intolerances</h3>
          {diets.filter(d => d.type === 'Allergy' ||
            d.type === 'Allergy / Intolerance' ||
            d.type === 'Allergy / Sensitivity').map(diet => (
            <div key={diet.name} className="faq-item">
              <h4 className="faq-question">{diet.name}
                <span className="diet-type-tag">{diet.type}</span>
              </h4>
              <div className="faq-answer">
                {diet.description.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="faq-section">
          <h3 className="faq-section-title">Religious Dietary Laws</h3>
          {diets.filter(d => d.type === 'Religious Dietary Law').map(diet => (
            <div key={diet.name} className="faq-item">
              <h4 className="faq-question">{diet.name}
                <span className="diet-type-tag">{diet.type}</span>
              </h4>
              <div className="faq-answer">
                {diet.description.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="faq-footer">
          <p>Have a question about a specific diet or allergy not
          listed here? <Link to="/feedback">Let us know</Link> and
          we'll add it.</p>
        </div>
      </div>
    </main>
  )
}

export default Diets