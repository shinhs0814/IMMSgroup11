/**
 * Can I Eat? — User Experience Survey
 *
 * HOW TO USE:
 * 1. Go to https://script.google.com and create a new project
 * 2. Paste this entire file into the editor (replace any existing code)
 * 3. Click Run → createCanIEatSurvey
 * 4. Authorize the script when prompted
 * 5. Check the Execution Log (View → Logs) for the form URL
 */

function createCanIEatSurvey() {
  var form = FormApp.create('Can I Eat? — User Experience Survey');
  form.setDescription('Takes about 3–5 minutes · All answers are anonymous\n\nYour answers are used only for the Can I Eat? research presentation. No personal data is shared or stored externally.');
  form.setConfirmationMessage('Thank you so much! 🙏\n\nYour feedback directly helps us build a safer food experience for everyone.\n\nScan, Safe, Eat. Anywhere.');
  form.setCollectEmail(false);
  form.setAllowResponseEdits(false);
  form.setLimitOneResponsePerUser(false);

  // ══════════════════════════════════════════
  // SECTION A — ABOUT YOU
  // ══════════════════════════════════════════

  form.addSectionHeaderItem()
    .setTitle('A · About You')
    .setHelpText('Tell us a little about your background');

  // Q1 — Role (radio, required)
  form.addMultipleChoiceItem()
    .setTitle('1. What best describes you?')
    .setChoiceValues([
      'Traveler visiting Korea',
      'Expat / foreign resident in Korea',
      'Korean who travels internationally',
      'International student in Korea',
      'Other'
    ])
    .setRequired(true);

  // Q2 — Dietary needs (checkbox, required)
  form.addCheckboxItem()
    .setTitle('2. Do you have any dietary restrictions or food needs?')
    .setHelpText('Select all that apply')
    .setChoiceValues([
      'Food allergies (peanuts, shellfish, dairy…)',
      'Medical diet (diabetic, celiac, kidney disease…)',
      'Vegan / vegetarian / pescatarian',
      'Halal',
      'Kosher',
      'Lifestyle preference (keto, gluten-free, low-carb…)',
      'No restrictions'
    ])
    .setRequired(true);

  // ══════════════════════════════════════════
  // SECTION B — THE FOOD SAFETY STRUGGLE
  // ══════════════════════════════════════════

  form.addPageBreakItem()
    .setTitle('B · The Food Safety Struggle')
    .setHelpText('Your experience before using Can I Eat?');

  form.addSectionHeaderItem()
    .setTitle('')
    .setHelpText('Think about a time you stood in front of unfamiliar food — in a supermarket, restaurant, or convenience store — and weren\'t sure if it was safe for you.');

  // Q3 — Frequency (radio, required)
  form.addMultipleChoiceItem()
    .setTitle('3. How often did you face uncertainty about whether food was safe for your dietary needs?')
    .setChoiceValues([
      'Every day',
      'A few times a week',
      'Every time I traveled / went shopping',
      'Rarely',
      'Never'
    ])
    .setRequired(true);

  // Q4 — Previous tools (checkbox, required)
  form.addCheckboxItem()
    .setTitle('4. What did you use before to check if food was safe?')
    .setHelpText('Select all that apply')
    .setChoiceValues([
      'Papago / Google Translate (photograph label)',
      'Google searched each ingredient one by one',
      'Asked a Korean-speaking person for help',
      'Just avoided the food entirely',
      'Guessed and hoped for the best',
      'Nothing — there was no good solution'
    ])
    .setRequired(true);

  // Q5 — Time to verify (radio, optional)
  form.addMultipleChoiceItem()
    .setTitle('5. Roughly how long did it take to verify whether one food item was safe for you?')
    .setChoiceValues([
      'Under 1 min',
      '1–5 min',
      '5–15 min',
      '15+ min',
      'N/A'
    ]);

  // Q6 — Frustrating moment (long text, optional)
  form.addParagraphTextItem()
    .setTitle('6. Describe the most frustrating moment you had trying to figure out if food was safe for you. What happened?')
    .setHelpText('This is the quote we\'d love to use in our presentation 🙏');

  // ══════════════════════════════════════════
  // SECTION C — APP EXPERIENCE
  // ══════════════════════════════════════════

  form.addPageBreakItem()
    .setTitle('C · Your Experience with Can I Eat?')
    .setHelpText('After using the app');

  // Q7 — Features tried (checkbox, required)
  form.addCheckboxItem()
    .setTitle('7. Which features did you try?')
    .setHelpText('Select all that apply')
    .setChoiceValues([
      'Food photo scan',
      'Food label scan',
      'Barcode scan',
      'Menu scan',
      'Food / restaurant search',
      'Food Passport (QR code)',
      'Family profiles'
    ])
    .setRequired(true);

  // Q8 — App response time (radio, optional)
  form.addMultipleChoiceItem()
    .setTitle('8. How long did it take to get a verdict from the app?')
    .setChoiceValues([
      'Under 5 sec',
      '5–15 sec',
      '15–30 sec',
      '30+ sec'
    ]);

  // Q9 — Accuracy (scale 1–5, required)
  form.addScaleItem()
    .setTitle('9. How accurate did the verdict feel?')
    .setBounds(1, 5)
    .setLabels('Not accurate', 'Very accurate')
    .setRequired(true);

  // Q10 — Unsafe ingredient caught (radio, optional)
  form.addMultipleChoiceItem()
    .setTitle('10. Did the app catch an unsafe ingredient you would have missed otherwise?')
    .setChoiceValues([
      'Yes — and it was something I would definitely have eaten',
      'Yes — a minor flag I might have noticed eventually',
      'No — the food was safe',
      'Not sure'
    ]);

  // Q11 — Story (long text, optional)
  form.addParagraphTextItem()
    .setTitle('11. In your own words, describe the moment you used Can I Eat? and what happened.')
    .setHelpText('Be as specific as possible — which food, where, what the verdict was, how it made you feel.');

  // ══════════════════════════════════════════
  // SECTION D — IMPACT & OVERALL FEELING
  // ══════════════════════════════════════════

  form.addPageBreakItem()
    .setTitle('D · Impact & Overall Feeling')
    .setHelpText('Help us understand the real value');

  // Q12 — Time saved (radio, required)
  form.addMultipleChoiceItem()
    .setTitle('12. Compared to before, how much time does Can I Eat? save you when checking food?')
    .setChoiceValues([
      'Massive — what used to take 10+ minutes now takes seconds',
      'Some — a few minutes saved each time',
      'A little',
      'No real difference'
    ])
    .setRequired(true);

  // Q13 — Confidence change (scale 1–5, required)
  form.addScaleItem()
    .setTitle('13. How confident do you feel eating out or shopping now compared to before?')
    .setBounds(1, 5)
    .setLabels('Less confident', 'Much more confident')
    .setRequired(true);

  // Q14 — NPS (scale 1–10, required)
  form.addScaleItem()
    .setTitle('14. How likely are you to recommend Can I Eat? to a friend with dietary restrictions?')
    .setHelpText('NPS Score: 9–10 = Promoter · 7–8 = Passive · 1–6 = Detractor')
    .setBounds(1, 10)
    .setLabels('Not at all', 'Definitely')
    .setRequired(true);

  // Q15 — Unique value (long text, optional)
  form.addParagraphTextItem()
    .setTitle('15. What is the ONE thing Can I Eat? does that nothing else does for you?')
    .setHelpText('The answer we\'d love to put on the slide verbatim ✨');

  // Q16 — Feature requests / issues (long text, optional)
  form.addParagraphTextItem()
    .setTitle('16. Any features you wish existed, or anything that didn\'t work well?')
    .setHelpText('Your honest feedback helps us improve...');

  // Q17 — Quote permission (radio, optional)
  form.addMultipleChoiceItem()
    .setTitle('17. May we quote you (anonymously) in our presentation?')
    .setChoiceValues([
      'Yes, anonymously',
      'Yes, with my name',
      'No'
    ]);

  // Q18 — Name / nationality (short text, optional)
  form.addTextItem()
    .setTitle('18. Your name / nationality (optional)')
    .setHelpText('e.g. Sarah, UK — or leave blank');

  // ══════════════════════════════════════════
  // DONE — log URLs
  // ══════════════════════════════════════════

  Logger.log('✅ Form created successfully!');
  Logger.log('📋 Respondent URL: ' + form.getPublishedUrl());
  Logger.log('✏️  Editor URL:    ' + form.getEditUrl());
}
