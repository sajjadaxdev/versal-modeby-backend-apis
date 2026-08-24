/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {

  await knex("translations").del();
  await knex("languages").del();

  await knex("languages").insert([
    { name: "English", native_name: "English",code: "en", direction: "ltr", is_active: true, is_default: true },
    { name: "Pashto",  native_name: "پښتو",code: "ps", direction: "rtl", is_active: true, is_default: false },
  ]);

  await knex("translations").insert([
    // English
    { lang_code: "en", key_name: "appName",                 value: "Moheby" },
    { lang_code: "en", key_name: "setPickupPoint",          value: "Set Pickup Point" },
    { lang_code: "en", key_name: "whereToGo",               value: "Where To Go?" },
    { lang_code: "en", key_name: "whereYouWantToGo",        value: "Where do you want to go?" },
    { lang_code: "en", key_name: "enterYourRoute",          value: "Enter your route" },
    { lang_code: "en", key_name: "findDriver",              value: "Find Driver" },
    { lang_code: "en", key_name: "from",                    value: "From" },
    { lang_code: "en", key_name: "to",                      value: "To" },
    { lang_code: "en", key_name: "fetchingAddress",         value: "Fetching address..." },
    { lang_code: "en", key_name: "changeDestination",       value: "Change destination" },
    { lang_code: "en", key_name: "sameAddressError",        value: "To and From addresses cannot be the same." },
    { lang_code: "en", key_name: "locationFetchError",      value: "Could not fetch location or same address selected." },
     
    { lang_code: "en", key_name: "continueWithGoogle",      value: "Continue with Google" },
    { lang_code: "en", key_name: "continueWithPhone",       value: "Continue with Phone Number" },
    { lang_code: "en", key_name: "homeRideCityToCity",      value: "City to city" },
    { lang_code: "en", key_name: "cityRide",                value: "City Ride" },
       
    { lang_code: "en", key_name: "onboard1Title",           value: "Wherever you are" },
    { lang_code: "en", key_name: "onboard1Desc",            value: "Request a cab from your location and travel safely within your city." },
    { lang_code: "en", key_name: "onboard2Title",           value: "Inside the city" },
    { lang_code: "en", key_name: "onboard2Desc",            value: "Daily travel made easy. Choose route, agree fare, ride instantly." },
    { lang_code: "en", key_name: "onboard3Title",           value: "City to city" },
     
    { lang_code: "en", key_name: "onboard3Desc",            value: "Plan intercity trips with comfort and transparent pricing." },
  
    { lang_code: "en", key_name: "back",                    value: "Back" },
    { lang_code: "en", key_name: "verifyPhoneNumber",       value: "Verify Phone Number" },
    { lang_code: "en", key_name: "verifyPhoneNumberDesc",   value: "You'll get a code to verify your phone number." },
    { lang_code: "en", key_name: "enterPhoneNumber",        value: "Enter your phone number" },
    { lang_code: "en", key_name: "sendOTP",                 value: "Send OTP" },
    { lang_code: "en", key_name: "otpSent",                 value: "OTP has been sent successfully." },
  
    { lang_code: "en", key_name: "enterValidPhoneNumber",   value: "Enter a valid 9-digit phone number." },
    { lang_code: "en", key_name: "failedToSendOtp",         value: "Failed to send OTP." },
    { lang_code: "en", key_name: "somethingWentWrong",      value: "Something went wrong. Please try again." },
  
    { lang_code: "en", key_name: "enterCode",               value: "Enter the code" },
    { lang_code: "en", key_name: "codeSentTo",              value: "We sent you a code on" },
    { lang_code: "en", key_name: "didntReceiveCode",        value: "Didn't receive the code?" },
    { lang_code: "en", key_name: "resendAgain",             value: "Resend again" },
    { lang_code: "en", key_name: "verify",                  value: "Verify" },
    { lang_code: "en", key_name: "invalidOTP",              value: "Invalid OTP." },

    { lang_code: "en", key_name: "enterYourName",           value: "Enter your name" },
    { lang_code: "en", key_name: "updateProfileNameDesc",   value: "Please update your profile name" },
    { lang_code: "en", key_name: "userName",                value: "User Name" },
    { lang_code: "en", key_name: "continue",                value: "Continue" },

    { lang_code: "en", key_name: "nameRequired",            value: "Name is required" },
    { lang_code: "en", key_name: "failedToUpdateName",      value: "Failed to update name" },
    { lang_code: "en", key_name: "nameUpdatedSuccessfully", value: "Name updated successfully" },

    { lang_code: "en", key_name: "settings",                value: "Settings" },
    { lang_code: "en", key_name: "profileSettings",         value: "Profile Settings" },
    { lang_code: "en", key_name: "documents",               value: "Documents" },
    { lang_code: "en", key_name: "verified",                value: "Verified" },
    { lang_code: "en", key_name: "phoneNumber",             value: "Phone Number" },
    { lang_code: "en", key_name: "language",                value: "Language" },
    { lang_code: "en", key_name: "distance",                value: "Distance" },
    { lang_code: "en", key_name: "darkMode",                value: "Dark Mode" },
    { lang_code: "en", key_name: "system",                  value: "System" },
    { lang_code: "en", key_name: "rulesAndTerms",           value: "Rules and Terms" },
    { lang_code: "en", key_name: "logout",                  value: "Logout" },
    { lang_code: "en", key_name: "deleteMyAccount",         value: "Delete My Account" },

    { lang_code: "en", key_name: "cityToCityRide", value: "City to City Ride" },
    { lang_code: "en", key_name: "requestHistory", value: "Request History" },
    { lang_code: "en", key_name: "notification", value: "Notification" },
    { lang_code: "en", key_name: "safety", value: "Safety" },
    { lang_code: "en", key_name: "help", value: "Help" },
    { lang_code: "en", key_name: "support", value: "Support" },
    { lang_code: "en", key_name: "driverMode", value: "Driver Mode" },
    { lang_code: "en", key_name: "user", value: "User" },

    // =================================== Pashto ================================================
    { lang_code: "ps", key_name: "appName",                 value: "موهیبي" },
    { lang_code: "ps", key_name: "setPickupPoint",          value: "د سپرېدو ځای وټاکئ" },
    { lang_code: "ps", key_name: "whereToGo",               value: "چیرته غواړئ لاړ شئ؟" },
    { lang_code: "ps", key_name: "whereYouWantToGo",        value: "چیرته غواړئ لاړشئ؟" },
    { lang_code: "ps", key_name: "enterYourRoute",          value: "خپل لار دننه کړئ" },
    { lang_code: "ps", key_name: "findDriver",              value: "ډرایور ومومئ" },
    { lang_code: "ps", key_name: "from",                    value: "له" },
    { lang_code: "ps", key_name: "to",                      value: "ته" },
    { lang_code: "ps", key_name: "fetchingAddress",         value: "پته ترلاسه کیږي..." },
    { lang_code: "ps", key_name: "changeDestination",       value: "منزل بدل کړئ" },
    { lang_code: "ps", key_name: "sameAddressError",        value: "د راتګ او تګ پتې یو شان نشي کیدای." },
    { lang_code: "ps", key_name: "locationFetchError",      value: "موقعیت ترلاسه نشو." },
    { lang_code: "ps", key_name: "continueWithGoogle",      value: "د ګوګل سره دوام ورکړئ" },
    { lang_code: "ps", key_name: "continueWithPhone",       value: "د تلیفون نمبر سره دوام ورکړئ" },
    { lang_code: "ps", key_name: "cityRide",                value: "د ښار سفر" },
     
    { lang_code: "ps", key_name: "onboard1Title",           value: "چیرې چې یاست" },
    { lang_code: "ps", key_name: "onboard1Desc",            value: "له خپل ځایه کیب وغواړئ او د ښار دننه خوندي سفر وکړئ." },
    { lang_code: "ps", key_name: "onboard2Title",           value: "د ښار دننه" },
    { lang_code: "ps", key_name: "onboard2Desc",            value: "ورځنی سفر اسانه شو. لار غوره کړئ، کرایه ومنئ، سمدلاسه سفر وکړئ." },
    { lang_code: "ps", key_name: "onboard3Title",           value: "ښار نه ښار ته" },
    { lang_code: "ps", key_name: "homeRideCityToCity",      value: "ښار نه ښار ته" },
    { lang_code: "ps", key_name: "onboard3Desc",            value: "د آرامۍ او شفاف نرخونو سره د ښارونو تر منځ سفرونه پلان کړئ." },
  
    { lang_code: "ps", key_name: "back",                    value: "شاته" },
    { lang_code: "ps", key_name: "verifyPhoneNumber",       value: "د تلیفون شمېره تایید کړئ" },
    { lang_code: "ps", key_name: "verifyPhoneNumberDesc",   value: "تاسو ته به یو کوډ درولېږل شي ترڅو خپل د تلیفون شمېره تایید کړئ." },
    { lang_code: "ps", key_name: "enterPhoneNumber",        value: "خپل د تلیفون شمېره دننه کړئ" },
    { lang_code: "ps", key_name: "sendOTP",                 value: "OTP واستوئ" },
    { lang_code: "ps", key_name: "otpSent",                 value: "د تایید کوډ (OTP) په بریالیتوب سره واستول شو." },
  
    { lang_code: "ps", key_name: "enterValidPhoneNumber",   value: "مهرباني وکړئ د ۹ عددي معتبر تلیفون شمېره دننه کړئ." },
    { lang_code: "ps", key_name: "failedToSendOtp",         value: "د OTP لېږل ناکام شول." },
    { lang_code: "ps", key_name: "somethingWentWrong",      value: "یو څه ستونزه رامنځته شوه، مهرباني وکړئ بیا هڅه وکړئ." },

    { lang_code: "ps", key_name: "enterCode",               value: "کوډ دننه کړئ" },
    { lang_code: "ps", key_name: "codeSentTo",              value: "موږ دې شمېرې ته کوډ لېږلی دی" },
    { lang_code: "ps", key_name: "didntReceiveCode",        value: "کوډ مو ترلاسه نه کړ؟" },
    { lang_code: "ps", key_name: "resendAgain",             value: "بیا یې ولېږئ" },
    { lang_code: "ps", key_name: "verify",                  value: "تایید کړئ" },
    { lang_code: "ps", key_name: "invalidOTP",              value: "ناسم OTP." },
  
    { lang_code: "ps", key_name: "enterYourName",           value: "خپل نوم دننه کړئ" },
    { lang_code: "ps", key_name: "updateProfileNameDesc",   value: "مهرباني وکړئ د خپل پروفایل نوم تازه کړئ" },
    { lang_code: "ps", key_name: "userName",                value: "د کارونکي نوم" },
    { lang_code: "ps", key_name: "continue",                value: "دوام ورکړئ" },

    { lang_code: "ps", key_name: "nameRequired",            value: "نوم اړین دی" },
    { lang_code: "ps", key_name: "failedToUpdateName",      value: "د نوم تازه کول ناکام شول" },
    { lang_code: "ps", key_name: "nameUpdatedSuccessfully", value: "نوم په بریالیتوب سره تازه شو" },

    { lang_code: "ps", key_name: "settings",        value: "تنظیمات" },
    { lang_code: "ps", key_name: "profileSettings", value: "د پروفایل تنظیمات" },
    { lang_code: "ps", key_name: "documents",       value: "اسناد" },
    { lang_code: "ps", key_name: "verified",        value: "تصدیق شوی" },
    { lang_code: "ps", key_name: "phoneNumber",     value: "د تلیفون شمېره" },
    { lang_code: "ps", key_name: "language",        value: "ژبه" },
    { lang_code: "ps", key_name: "distance",        value: "واټن" },
    { lang_code: "ps", key_name: "darkMode",        value: "تیاره بڼه" },
    { lang_code: "ps", key_name: "system",          value: "سیسټم" },
    { lang_code: "ps", key_name: "rulesAndTerms",   value: "قوانین او شرایط" },
    { lang_code: "ps", key_name: "logout",          value: "وتل" },
    { lang_code: "ps", key_name: "deleteMyAccount", value: "زما حساب حذف کړئ" },

    { lang_code: "ps", key_name: "cityToCityRide", value: "له ښار څخه ښار ته سفر" },
    { lang_code: "ps", key_name: "requestHistory", value: "د غوښتنو تاریخ" },
    { lang_code: "ps", key_name: "notification", value: "خبرتیاوې" },
    { lang_code: "ps", key_name: "safety", value: "خوندیتوب" },
    { lang_code: "ps", key_name: "help", value: "مرسته" },
    { lang_code: "ps", key_name: "support", value: "ملاتړ" },
    { lang_code: "ps", key_name: "driverMode", value: "د چلوونکي حالت" },
    { lang_code: "ps", key_name: "user", value: "کارن" },

  ]);
  
};
