-- This data is for testing extraction of news notifications from the database to be displayed in the inbox.
-- TRUNCATE TABLE
--   notificationrecipients,
--   newsnotifications,
--   claimnotifications,
--   notifications
-- RESTART IDENTITY
-- CASCADE;

BEGIN;

INSERT INTO Notifications (userid, type, title, body, isread, isarchived, datecreated) VALUES
('mike_wasabi', 'news', 'Your Tasks This Week:', 'TASKS THIS WEEK:

1. Familiarize yourself with the NotifAI web app and UI.

2. Upload the ics file for the calendar I sent you via gmail. This contains your tasks that are also mentioned in this notification.

3. There has been a change in a policy for one of your customers, and you need to contact them to inform them of the change. Message Mac Cheese with username mac_cheese about policy update #1324 at https://docs.google.com/document/d/17Jl_KZ_kKN5pB9UIcEfYPAvEx2OtPzcEOVotEQh8xHY/edit?tab=t.0

4. There is a claim filed that requires additional information. Please contact the customer and inform them of the next steps. The claim number is 123456, and the customer is Mac Cheese with username mac_cheese. Request that Mac sends Police Verification Report and Medical Records.
', false, false, NOW()),

('mike_wasabi', 'news', 'Welcome to Life Assured!', 'Hi Joy!

Welcome to the team at Life Assured! We are in the middle of transitioning our notification messaging system to the web app NotifAI. You have been selected to try the new messaging system, and you have been assigned a group of customers that also opted in to using NotifAI. To be specific, you will be receiving customers originally assigned to Tiff Taco, but she is retiring. You should expect another notification from me about your tasks this week. 

Mike Wasabi', false, false, NOW()),

('tiff_taco', 'news', 'I am Retiring', 'Hi Mac!

I am letting you know that I will be retiring in a week. You can expect that you will no longer be receiving notifications from me soon. I believe that you will be assigned to an employee called Joy Smiles. I wish you best of luck! ', false, false, '2025-05-1'),

('tiff_taco', 'news', 'Breaking News: Tech Innovation', 'The tech world is abuzz with excitement as several groundbreaking innovations are poised to reshape our technological landscape. Recent breakthroughs in artificial intelligence, particularly in the realm of machine learning and deep learning, promise to revolutionize various sectors, from healthcare and finance to transportation and entertainment. Were witnessing unprecedented advancements in processing power and data analysis capabilities, leading to more sophisticated and efficient algorithms.

Furthermore, significant strides are being made in the development of sustainable and renewable energy technologies. New advancements in solar power, wind energy, and battery storage are paving the way for a cleaner and more sustainable future. These innovations not only address environmental concerns but also offer significant economic opportunities.

In the realm of communication, we are seeing the emergence of more advanced and seamless connectivity solutions. The development of faster and more reliable internet infrastructure, along with the proliferation of 5G technology, is creating new possibilities for remote work, telehealth, and online education.

These are just a few examples of the many exciting technological developments currently underway. Stay tuned for further updates and in-depth analyses as these innovations continue to unfold and impact our lives in profound ways. We will keep you informed of the key developments and their potential implications.

', false, false, '2025-04-25'),
('tiff_taco', 'news', 'Health Alert: New Guidelines', 'Hi there,

Were sending this notification to inform you about updated health guidelines for the spring flu season. There has been new recommendations to help keep everyone healthy. This year, we recommend getting vaccinated earlier than usual.

You can find the full details and all the updated recommendations at National Health Associations front page. Please take a moment to review them—its important to stay protected during flu season!', false, false, '2025-04-24'),

('tiff_taco', 'news', 'Sports News: Championship Results', 'The championship results are in, and it was one of the closest competitions in history! Baller Boys and Slicked Paints were practically inseparable throughout the entire tournament, trading leads and showcasing incredible talent. The final match was a nail-biter, with the lead changing hands multiple times.

Ultimately, Baller Boys emerged victorious by 2 points after using their secret technique, also possibly because they were using our insurance plan. This incredibly close contest underscores the exceptional skill and dedication of both teams. It was a truly memorable championship, leaving fans breathless until the very end. Congratulations to both teams on an amazing season! Sports fans, consider viewing Life Assureds insurance plans related to sports!', false, false, '2025-04-23'),

('tiff_taco', 'news', 'Movie Premiere Safety and Insurance Reminders', 'The highly anticipated premiere of Nacho Sticks is this weekend, and we want to ensure you have a safe and enjoyable experience. Large crowds and excitement often lead to increased risks, so we remind you to be aware of your surroundings and take precautions against theft and accidents.

In addition to taking personal safety precautions, remember the insurance coverage you have with us. Your policy may provide protection for unforeseen events, such as broken bones, nausea, and brainrot. If anything unexpected happens, please contact us immediately to file a claim.

Have a great time at the movies!', false, false, '2025-04-22'),

('tiff_taco', 'news', 'Travel: New Destination', 'Were thrilled to announce the discovery of a breathtaking new travel destination, Mount Wasabi! This hidden gem boasts lush rainforests, beautiful views, and the real estate of Life Assureds boss, Mike Wasabi. Thats why its called Mount Wasabi. We know youre eager to explore, and we want to ensure your adventure is both memorable and safe.

Before you embark on your journey, please review the following regarding your travel insurance coverage:

Comprehensive Coverage: Your existing policy provides comprehensive coverage for unforeseen circumstances, including medical emergencies, trip cancellations, lost luggage, and personal liability. Weve expanded coverage to specifically include this new location.

Emergency Contact: Should you encounter any unexpected events or require assistance while travelling to Mount Wasabi, please contact our 24/7 emergency hotline. Were always available to offer support and guidance.

Important Considerations: Mount Wasabi may present unique challenges. We strongly recommend familiarizing yourself with local customs, laws, and any potential health risks. Consult your physician for necessary vaccinations or preventative measures before your trip.

Claim Procedure: In the event you need to file a claim, please ensure you gather all relevant documentation, including receipts, medical reports, and police reports (if applicable).

We wish you a safe and unforgettable adventure to Mount Wasabi! Remember, your well-being is our priority.', false, false, '2025-04-21'),

('tiff_taco', 'news', 'Food: Gourmet Recipe', 'Were excited to share a mouthwatering new gourmet recipe thats sure to impress! This Instant Noodle Delight is a culinary masterpiece, combining ingredients from local supermarkets with the superhuman talent of top chefs. Its perfect for a romantic dinner, a family gathering, or simply a delicious treat for yourself.

While youre enjoying this delicious meal, remember the importance of your insurance coverage. Unexpected events can happen anytime, even while preparing a gourmet feast: Kitchen accidents, food poisoning, and guest injuries. In case of an accident or emergency, please dont hesitate to contact us or your relevant insurance provider.
', false, false, '2025-04-20'),

('tiff_taco', 'news', 'Fashion: Latest Trends', 'This seasons fashion trends are bursting with vibrant colors, exciting textures, and innovative designs! From bold statement pieces to effortlessly chic everyday looks, theres something for everyone. Weve curated some inspiration below to help you stay ahead of the curve:

1. spaghetti jeans
2. old fashioned hats from those wild west movies
3. shower slippers

As you refresh your wardrobe with these stylish new additions, remember the importance of protecting your investments. Your insurance policy offers valuable protection against unexpected events that can impact your belongings. We encourage you to review your policy details to understand your specific coverage for personal property. If you have any questions, please dont hesitate to contact us.
', false, false, '2025-04-19'),

('tiff_taco', 'news', 'Home: Decor Ideas', 'Transform your living space into a haven of style and comfort with our curated collection of inspiring home décor ideas for the season! Whether youre looking for a complete overhaul or just a few subtle updates, these fresh concepts will ignite your creativity and help you create the home of your dreams.

But creating a beautiful home is only half the battle. Protecting your investment is just as important! Your homeowners insurance policy provides critical protection against unforeseen circumstances that could damage your property or belongings. We encourage you to review your homeowners insurance policy regularly to ensure it adequately meets your needs. Consider contacting us to discuss your coverage and identify any potential gaps in protection.
', false, false, '2025-04-18'),

('tiff_taco', 'news', 'Books: New Release', 'The literary world is abuzz with the release of The Man by Jenny Ketchup, a captivating new novel thats already garnering critical acclaim and capturing the hearts of readers everywhere! It is about a guy called Henry. We highly recommend adding it to your reading list! 

While youre engrossed in this exciting new story, its a good time to also take a moment to review your insurance coverage, particularly if your valuable possessions – books included! – are involved.
', false, false, '2025-04-17'),

('tiff_taco', 'news', 'Science: Breakthrough Discovery', 'The scientific community is buzzing with excitement over a groundbreaking new discovery! Researchers have achieved a major breakthrough in Physics, potentially leading to a new element being discovered!

Unfortunately, the two researchers involved have got into a fistfight over who the element gets to be named after. They are both in the emergency room, and the new element disappeared after the two wrecked the laboratory. The two also did not have insurance for fistfights. We advise you to double check your insurance plan to ensure you are compensated for any damages sustained from fistfights. 
', false, false, '2025-04-16'),
('tiff_taco', 'news', 'Business: New Partnership', 'The business world is abuzz with news of a significant new partnership between The Werner Oil Corporation and General Fossils! This collaboration brings together oil drilling and paleontology, creating a powerhouse with the potential to reshape the oil landscape. The combined resources and expertise of these two industry leaders promise a self sustainable supply of oil using dinosaur power.

As this exciting partnership unfolds, its also an opportune time to reassess your insurance needs, particularly if youre involved in similar ventures or if the new partnership impacts your business. We encourage you to carefully review your existing insurance policies to ensure they adequately address the evolving landscape of your business environment, especially in light of this major partnership. Contact us to discuss your specific needs and explore potential options for enhanced coverage.
', false, false, '2025-04-15'),

('tiff_taco', 'news', 'Education: New Courses', 'Exciting news! Were pleased to announce a new range of professional development courses designed to help you enhance your skills and advance your career. This semesters offerings are packed with engaging programs covering a variety of in-demand fields, including data analytics, project management, leadership training, and digital marketing. These courses are designed to help you make money. Yeah, money is not everything, but everyone likes a little money. I wonder who first came up with that idea first? Cause money is rocks and paper.

As you invest in your professional growth, it’s equally important to protect that investment. Consider these insurance-related aspects relevant to your professional development journey:

Tuition Reimbursement Insurance: Some employers offer tuition reimbursement programs, but unforeseen circumstances can disrupt your ability to complete your studies. A tuition reimbursement insurance policy can protect your investment in education should you face unexpected situations such as illness, injury, or job loss that prevent you from continuing your studies.

Professional Liability Insurance (Errors & Omissions): As you develop new skills and take on more responsibility, professional liability insurance, often called Errors & Omissions insurance, becomes increasingly important. This type of insurance protects you from financial losses resulting from claims of negligence or errors in your professional work. This is particularly relevant for professionals in fields like healthcare, finance, or consulting.

Disability Insurance: Unexpected illness or injury can significantly impact your ability to work and earn an income. Disability insurance provides financial protection during periods of disability, helping you maintain your lifestyle and cover expenses, including payments towards your professional development courses.

We encourage you to assess your current insurance coverage in light of your investment in professional development. Ensure you have adequate protection in place to support your career advancement and mitigate potential risks. Contact us if you have any questions or require assistance in reviewing your insurance options.
', false, false, '2025-04-14'),

('tiff_taco', 'news', 'Music: New Album', 'Get ready to groove! Ally Awesomes highly anticipated new album, "To the Top", has finally dropped, and its already making waves in the music industry! The album features a mix of upbeat pop anthems and soulful ballads, and groundbreaking exploration of electronic music. Early reviews are overwhelmingly positive, praising the artists vocal performance, the innovative production, and the emotionally resonant lyrics. This album is sure to be a chart-topper!

While youre enjoying this new musical masterpiece, let’s also consider the often-overlooked aspect of protecting your investments in music and entertainment. Many people build substantial collections of physical and digital media, and its worth considering how insurance can safeguard those assets:

Homeowners/Renters Insurance: Your existing homeowners or renters insurance likely covers the loss or damage of personal property, including your music collection (CDs, vinyl records, etc.). However, it’s important to check your policy limits and consider whether they adequately cover the value of your collection, especially if you own rare or valuable items. You may need to schedule separate coverage for high-value collectibles.

Digital Music Collections: While digital music isnt physically vulnerable to damage, its still subject to loss through device malfunction, data breaches, or account compromises. Review your device and account security measures. Consider backing up your digital music library regularly to a secure cloud service.

Concert and Event Tickets: If youre planning to attend a concert to celebrate this new album release, consider event cancellation insurance. This will protect you from financial loss should the event be canceled due to unforeseen circumstances.

We encourage you to review your insurance policies to ensure they adequately protect your musical investments. Contact us if you have any questions or want to explore options for additional coverage.
', false, false, '2025-04-13'),

('tiff_taco', 'news', 'Art: New Exhibition', 'Get ready to be inspired! A highly anticipated new art exhibition, "My Life", is opening this month at the Bromery Arts Center, and it promises to be a visual feast! Featuring the works of Don Artsy, the exhibition explores the interplay of light and shadow in contemporary landscapes, a retrospective showcasing the artists evolution over five decades, and a collection of vibrant abstract expressionist paintings. Critics are already calling it a must see!

As you prepare to immerse yourself in the world of art, its also a good time to consider the insurance implications, both for the artists and for art enthusiasts:

Art Insurance for Artists: For artists exhibiting their work, adequate insurance is crucial. Fine art insurance covers a range of risks, including damage, theft, or loss of artwork during transportation, storage, or display. This is particularly important for valuable or irreplaceable pieces. Policies can also include liability coverage in case of damage to a piece while in the artists possession.

Art Insurance for Collectors: For art collectors attending the exhibition and considering purchasing pieces, insuring your artwork is an essential part of responsible collecting. Policies can protect against damage, loss, and theft of artwork within the home or while traveling. Appraisals are often required to accurately assess the value of the artwork for insurance purposes.

Liability Insurance (for Galleries): Galleries should also have appropriate liability insurance in place to cover any accidents or injuries that might occur on their premises during the exhibition.

We encourage you to review your existing insurance policies to ensure you have the appropriate level of coverage to protect your artistic assets and investments. If you are an artist, gallery owner, or art collector, contact us to discuss your specific insurance needs and explore relevant policy options.
', false, false, '2025-04-12'),

('tiff_taco', 'news', 'Environment: Conservation Efforts', 'Exciting news for environmental conservation! New initiatives are underway to protect and preserve our planets precious natural resources. Green Beans has launched a significant project focused on reforestation efforts in the Amazon rainforest, marine wildlife protection in the Pacific Ocean, and habitat restoration in national parks. The organization is also hiring for people to help them! Since they have limited funding, they will pay salaries with organic vegatables instead.

While these conservation efforts are vital for the long-term health of our planet, its also important to consider the role of insurance in protecting the investments and assets involved in such initiatives:

Property Insurance for Conservation Sites: Buildings, equipment, and infrastructure used in conservation projects require protection against damage from natural disasters, vandalism, or accidents. Comprehensive property insurance is essential to safeguard these assets. This is particularly critical for remote or vulnerable locations.

Liability Insurance for Conservation Organizations: Organizations undertaking conservation efforts need liability insurance to protect themselves against lawsuits arising from accidents or injuries related to their activities. This is vital for protecting both volunteers and employees involved in field work.

Business Interruption Insurance: If unforeseen events disrupt conservation projects, business interruption insurance can provide financial protection to cover lost income and additional expenses incurred during recovery.

We encourage you to review your insurance coverage to ensure adequate protection for your involvement in or support of conservation efforts. Contact us to discuss your specific needs and explore relevant insurance options. Lets work together to protect both our planet and our investments in its future.
', false, false, '2025-04-11'),

('tiff_taco', 'news', 'Technology: New Gadget', 'The tech world is abuzz with the launch of Full VR Suit, a groundbreaking new device poised to revolutionize the gaming industry with a completely immersive experience! This innovative gadget boasts advanced AI capabilities and groundbreaking battery life. Early reviews are overwhelmingly positive, highlighting its realistic experience.

As this exciting new technology enters the market, it’s crucial to consider the insurance implications for both consumers and businesses:

Gadget Insurance for Consumers: Protecting your investment in this cutting-edge technology is vital. Gadget insurance provides coverage for accidental damage, theft, and loss. This is particularly important considering the high cost of many new technological devices, especially those with advanced features. Policies often include options for repairs or replacements. Consider comparing different insurance options to find the best coverage for your needs and budget.

We encourage you to review your insurance policies to ensure adequate coverage for your personal or business needs related to this exciting new technology. Contact us to discuss your specific requirements and explore the various insurance options available.
', false, false, '2025-04-10'),

('tiff_taco', 'news', 'Finance: Investment Tips', 'Were pleased to share some insightful investment tips to help you navigate the ever-evolving financial landscape and grow your wealth wisely. The current market presents both opportunities and challenges, and careful planning is key to achieving your financial goals. While you focus on building your investment portfolio, dont overlook the importance of insurance in protecting your financial future. Here are some crucial aspects to consider:

Umbrella Liability Insurance: This broadens your liability coverage beyond your homeowners or auto insurance policies, offering added protection against significant lawsuits. This is particularly beneficial as your net worth increases through successful investments. It acts as an extra layer of protection against unforeseen circumstances.

Investment Portfolio Insurance: While not a standard type of insurance, there are strategies to manage investment risk and protect against substantial portfolio losses. These can range from diversification techniques (as mentioned above) to actively managed funds with risk mitigation strategies. Consulting a financial advisor is highly recommended.

Disability Insurance: Unexpected illness or injury can severely impact your ability to earn an income, jeopardizing your investment goals. Disability insurance provides crucial financial support during periods of disability, helping you cover expenses and continue your investment strategy.

Remember, investing wisely involves both proactive growth strategies and protective measures. We strongly encourage you to consult with a qualified financial advisor to tailor an investment and insurance strategy specifically designed for your individual circumstances and risk tolerance.
', false, false, '2025-04-9'),

('tiff_taco', 'news', 'Economics: Market Analysis', 'Todays market shows mixed performance across sectors, a slight dip in the tech sector, and a surge in energy stocks. Remember that market fluctuations are inherent, and this analysis is for informational purposes only and not financial advice. While you navigate the complexities of the market, its crucial to remember the role insurance plays in protecting your investments from unforeseen events. Here’s how:

Investment Portfolio Insurance: While not a specific insurance product, risk management strategies and diversification are essential. Consider consulting a financial advisor for portfolio structuring to mitigate risk and maximize potential returns. This is far more proactive than relying on insurance to fix losses after they occur.

Liability Insurance (if applicable): If your investments involve business ventures, ensuring adequate liability coverage is essential to protect you from potential lawsuits related to your business activities. This is especially important in volatile market conditions where business decisions are scrutinized more closely.

Cybersecurity Insurance: With the growing reliance on online trading and financial technology, protecting your digital assets is critical. Cybersecurity insurance covers losses related to data breaches, hacking attempts, and other cyber threats that can impact your investments.

We encourage you to review your existing insurance policies regularly and consider seeking professional financial advice to best safeguard your investments. Remember, a comprehensive insurance strategy, combined with prudent investment practices, is vital for long-term financial success.
', false, false, '2025-04-8');

INSERT INTO NewsNotifications (notificationid, expirationdate, type) VALUES
(1, '2025-05-20', 'urgent'),
(2, '2025-05-20', 'general'),
(3, '2025-05-8', 'urgent'),
(4, '2025-05-1', 'general'),
(5, '2025-04-29', 'general'),
(6, '2025-04-28', 'general'),
(7, '2025-04-27', 'general'),
(8, '2025-04-26', 'general'),
(9, '2025-04-25', 'general'),
(10, '2025-04-24', 'general'),
(11, '2025-04-23', 'general'),
(12, '2025-04-22', 'general'),
(13, '2025-04-21', 'general'),
(14, '2025-04-20', 'general'),
(15, '2025-04-19', 'general'),
(16, '2025-04-18', 'general'),
(17, '2025-04-17', 'general'),
(18, '2025-04-16', 'general'),
(19, '2025-04-15', 'general'),
(20, '2025-04-14', 'general'),
(21, '2025-04-13', 'general');

INSERT INTO NotificationRecipients (notificationid, recipientid, datesent) VALUES
(1, 'joy_smiles', NOW()),
(2, 'joy_smiles', NOW()),
(3, 'mac_cheese', NOW()),
(4, 'mac_cheese', NOW()),
(5, 'mac_cheese', NOW()),
(6, 'mac_cheese', NOW()),
(7, 'mac_cheese', NOW()),
(8, 'mac_cheese', NOW()),
(9, 'mac_cheese', NOW()),
(10, 'mac_cheese', NOW()),
(11, 'mac_cheese', NOW()),
(12, 'mac_cheese', NOW()),
(13, 'mac_cheese', NOW()),
(14, 'mac_cheese', NOW()),
(15, 'mac_cheese', NOW()),
(16, 'mac_cheese', NOW()),
(17, 'mac_cheese', NOW()),
(18, 'mac_cheese', NOW()),
(19, 'mac_cheese', NOW()),
(20, 'mac_cheese', NOW()),
(21, 'mac_cheese', NOW());

COMMIT;
