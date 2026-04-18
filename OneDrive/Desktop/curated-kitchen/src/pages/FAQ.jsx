import { Link } from 'react-router-dom'
import './FAQ.css'

const faqs = [
  {
    section: 'About Spoon Theory',
    items: [
      {
        q: 'What is Spoon Theory?',
        a: `Spoon Theory is a metaphor created by Christine Miserandino to describe the limited amount of energy available to people living with chronic illness, disability, or neurodivergence. The idea is simple: imagine you start each day with a certain number of "spoons," each representing a unit of energy. Every task you do costs spoons — and once they're gone, they're gone. Unlike people without these conditions, you can't always just "push through" when you run out.

The theory has been widely adopted by people with conditions like fibromyalgia, lupus, ME/CFS, ADHD, autism, depression, anxiety, and many others. It gives people a shared language to explain their energy limits to others — and to themselves.`
      },
      {
        q: 'Why does Curated Kitchen use Spoon Theory?',
        a: `Cooking is one of the most energy-intensive daily tasks, and yet most recipe sites treat all cooks as equally able-bodied and energized. We don't. Curated Kitchen was built with the belief that food should be accessible to everyone — regardless of how many spoons you have today.

Our Spoon Score system lets you filter recipes by effort level, so on a low-spoon day you can find something truly manageable, and on a high-spoon day you can take on something more ambitious. We also built our scoring around real components — chopping, lifting, monitoring, multitasking — so the scores reflect actual physical and cognitive effort.`
      },
      {
        q: 'Where can I learn more about Spoon Theory?',
        a: `Spoon Theory was first described by Christine Miserandino in her essay "The Spoon Theory," originally published on ButYouDontLookSick.com. We encourage you to seek out her original work. The concept has also been discussed extensively in chronic illness and disability communities online.`
      }
    ]
  },
  {
    section: 'About the Spoon Score',
    items: [
      {
        q: 'How is the Spoon Score calculated?',
        a: `Our Spoon Score is calculated from up to 11 components, each representing a different type of effort involved in cooking. These include chopping and cutting, stirring frequency, kneading and mixing, lifting, stovetop monitoring, multitasking level, timing precision, fine motor tasks, passive waiting time, ingredient count, and task switching.

Each component is scored on a scale, and the raw scores are added together out of a maximum of 115 points. That total is then scaled to a score out of 100, and displayed as a spoon rating out of 10 (rounded to the nearest 0.5).

Some components are answered by the recipe uploader. Others — like ingredient count, passive waiting time, and task switching — are detected automatically from the recipe's ingredients and steps.`
      },
      {
        q: 'What do the spoon scores mean?',
        a: `1–2 spoons: Very low effort. Minimal prep, little to no monitoring, few ingredients. Great for low-energy days.

3–4 spoons: Low to moderate effort. Some chopping or stirring involved, but manageable for most people on an average day.

5–6 spoons: Moderate effort. Multiple tasks, active monitoring, or more complex prep required.

7–8 spoons: High effort. Significant multitasking, precise timing, or physically demanding tasks involved.

9–10 spoons: Very high effort. Reserved for complex recipes requiring sustained focus, fine motor skills, or long active cooking times.`
      },
      {
        q: 'Can I get a personalized Spoon Score?',
        a: `Yes — subscribers can set up a personal equipment and ability profile. Your personalized score adjusts based on the tools you have available (which can reduce effort) and your personal energy profile. For example, if you have a food processor, chopping-heavy recipes will score lower for you than for someone doing it by hand.

Personalized scoring is only available to subscribers. You can learn more on our membership page.`
      },
      {
        q: 'Are the Spoon Scores accurate?',
        a: `We do our best to make them as accurate as possible, but they are estimates based on the information provided by the recipe uploader and our automated detection. Individual experiences will vary; what feels like a 3-spoon recipe to one person may feel like a 5-spoon recipe to another, depending on their specific condition, tools, and environment.

We encourage you to use the scores as a guide rather than a guarantee, and to filter based on what works for you personally.`
      },
      {
        q: 'What is the Effort Scoring Cookbook?',
        a: `The Effort Scoring Cookbook is our internal scoring guide that defines exactly how each component of the Spoon Score is calculated. We publish it openly because we believe in transparency — you should be able to understand exactly why a recipe got the score it did, and uploaders should have a clear reference when answering the scoring questions.

You can view the full Effort Scoring Cookbook on our scoring documentation page.`
      }
    ]
  },
  {
    section: 'Ratings & Reviews',
    items: [
      {
        q: 'What is the Well Seasoned badge?',
        a: `The Well Seasoned badge is awarded to recipes that have received at least 40 ratings with an average of 4.5 stars or higher. It indicates that a recipe has been tried, tested, and loved by a significant number of community members.`
      },
      {
        q: 'What is the Trusted Chef badge?',
        a: `The Trusted Chef badge is earned by uploaders whose account is at least 30 days old, who have uploaded 15 or more recipes, and where at least 66% of their recipes have earned the Well Seasoned badge. It recognizes consistently high-quality contributors to the community.`
      }
    ]
  },
  {
    section: 'Allergen & Dietary Information',
    items: [
      {
        q: 'How accurate is the allergen detection?',
        a: `Our allergen detection is automated and based on ingredient keyword matching. It is not perfect. We strongly encourage anyone with food allergies or intolerances to read the full ingredient list of every recipe before cooking, regardless of what tags are displayed.

When a recipe is uploaded, our system flags potential allergens and suggests dietary tags to the uploader — but these are suggestions, not guarantees. Always verify.`
      },
      {
        q: 'Can I filter by allergen?',
        a: `Yes. You can use the Exclude Ingredients feature in Browse to filter out recipes containing specific ingredients. Type any ingredient into the exclusion box and press Enter. Subscribers can exclude up to 15 ingredients simultaneously.

Please remember that our detection is not perfect and always double-check ingredients if you have a serious allergy.`
      }
    ]
  },
  {
    section: 'Accounts & Membership',
    items: [
      {
        q: 'What can I do without an account?',
        a: `Guests can browse all recipes, view nutrition information, and use one ingredient exclusion filter. You can also view ratings and comments without an account.`
      },
      {
        q: 'What does a subscription include?',
        a: `Subscribers get access to personalized Spoon-Based Scoring, unlimited saved recipes, up to 15 ingredient exclusions, ad-free browsing, grocery list generation, Recipe Card mode with timers, holiday and seasonal filters, and more. See our membership page for a full comparison.`
      },
      {
        q: 'Is my launch pricing locked in?',
        a: `Yes. Subscribers who sign up during the launch pricing period are grandfathered at that rate for the lifetime of their account, regardless of any future price increases.`
      }
    ]
  },
  {
    section: 'Nowz Foodz',
    items: [
      {
        q: 'What is Nowz Foodz?',
        a: `Nowz Foodz are foods that require minimal effort — if any — to prepare. This includes premade snacks, boxed or frozen meals, canned goods, energy drinks, protein bars, and other ready-to-eat items. They're designed for the days when cooking simply isn't an option.

Unlike our recipes, Nowz Foodz items do not have a Spoon Score. By definition, they require little to no preparation effort. The goal is simply to help you find packaged foods that fit your dietary needs when your spoons are gone.`
      },
      {
        q: 'How is nutritional information sourced for Nowz Foodz?',
        a: `Nutritional information for Nowz Foodz items is sourced from Open Food Facts, a free and open database of food products from around the world. This information is provided as a guide only.

Always check the actual product label before purchasing or consuming, especially if you have food allergies or specific dietary requirements. Nutritional content can vary between product batches, regional variations, and formula changes by manufacturers.`
      },
      {
        q: 'Can I suggest a product for Nowz Foodz?',
        a: `Yes! If you know of a packaged food or drink that fits a specific diet and you think the community would benefit from having it listed, you can submit it via the barcode lookup tool on the Nowz Foodz page. All submissions are reviewed before being published.`
      },
      {
        q: 'Are allergen filters on Nowz Foodz reliable?',
        a: `Our allergen filters are based on data from Open Food Facts and are provided as a guide only. They may not capture every allergen, especially for products with complex ingredient lists or "may contain" warnings.

If you have a food allergy or intolerance, always read the full ingredient list on the actual product packaging before consuming. Do not rely solely on our filters for allergy management.`
      },
      {
        q: 'Does Curated Kitchen sell these products or have brand partnerships?',
        a: `No. Curated Kitchen is not affiliated with, endorsed by, or partnered with any of the brands listed in Nowz Foodz. We do not sell products. We are a review and discovery platform only — similar to how a restaurant review site lists restaurants without selling food.

We do not make medical or health claims about any listed products. Dietary tags such as "Keto" or "Gluten-free" are based on nutritional data and ingredient lists, not medical certification. Always consult a healthcare professional for medical dietary advice.`
      }
    ]
  }
]

function FAQ() {
  return (
    <main className="main">
      <div className="faq-layout">
        <div className="faq-header">
          <h2>Frequently Asked Questions</h2>
          <p>Everything you need to know about Curated Kitchen,
          Spoon Theory, and how our scoring works.</p>
        </div>

        {faqs.map(section => (
          <div key={section.section} className="faq-section">
            <h3 className="faq-section-title">{section.section}</h3>
            {section.items.map(item => (
              <div key={item.q} className="faq-item">
                <h4 className="faq-question">{item.q}</h4>
                <div className="faq-answer">
                  {item.a.split('\n\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}

        <div className="faq-footer">
          <p>Still have questions? <Link to="/feedback">Contact us</Link> or
          visit our <Link to="/membership">membership page</Link> for
          more information.</p>
        </div>
      </div>
    </main>
  )
}

export default FAQ