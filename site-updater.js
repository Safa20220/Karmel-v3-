// Site Updater - ربط لوحة التحكم بالموقع الأساسي
// هذا الملف يربط بين لوحة التحكم والموقع الأساسي ويحدث المحتوى ديناميكياً

class SiteUpdater {
  constructor() {
    this.siteData = null;
    this.updateInterval = null;
    this.init();
  }

  // تهيئة النظام
  init() {
    console.log('SiteUpdater: بدء التهيئة...');
    this.loadSiteData();
    this.setupUpdateListener();
    this.updateAllSections();
    console.log('SiteUpdater: تمت التهيئة بنجاح');
  }

  // تحميل بيانات الموقع من localStorage
  loadSiteData() {
    try {
      const savedData = localStorage.getItem('karmelSiteData');
      if (savedData) {
        this.siteData = JSON.parse(savedData);
        console.log('SiteUpdater: تم تحميل البيانات من localStorage');
      } else {
        console.log('SiteUpdater: لا توجد بيانات محفوظة، استخدام البيانات الافتراضية');
        this.siteData = this.getDefaultData();
      }
    } catch (error) {
      console.error('SiteUpdater: خطأ في تحميل البيانات:', error);
      this.siteData = this.getDefaultData();
    }
  }

  // إعداد مستمع التحديثات
  setupUpdateListener() {
    // مراقبة التغييرات في localStorage
    window.addEventListener('storage', (e) => {
      if (e.key === 'karmelSiteData' || e.key === 'forceUpdate') {
        console.log('SiteUpdater: تم اكتشاف تحديث جديد');
        this.loadSiteData();
        this.updateAllSections();
      }
    });

    // فحص التحديثات كل 2 ثانية
    this.updateInterval = setInterval(() => {
      const forceUpdate = localStorage.getItem('forceUpdate');
      if (forceUpdate) {
        console.log('SiteUpdater: تم اكتشاف طلب تحديث إجباري');
        localStorage.removeItem('forceUpdate');
        this.loadSiteData();
        this.updateAllSections();
      }
    }, 2000);
  }

  // تحديث جميع الأقسام
  updateAllSections() {
    console.log('SiteUpdater: تحديث جميع الأقسام...');
    this.updateHeroSection();
    this.updateAboutSection();
    this.updatePartnersSection();
    this.updateServicesSection();
    this.updateContactSection();
    this.updateVisionSection();
    this.updateWhyKarmelSection();
    this.updatePrivacyPolicy();
    this.updateTermsAndConditions();
    console.log('SiteUpdater: تم تحديث جميع الأقسام');
  }

  // تحديث قسم Hero
  updateHeroSection() {
    if (!this.siteData?.hero) return;
    
    const hero = this.siteData.hero;
    const elements = {
      'hero-main-title': hero.title,
      'hero-main-desc': hero.desc1,
      'hero-main-btn': hero.button
    };

    Object.keys(elements).forEach(className => {
      const element = document.querySelector(`.${className}`);
      if (element) {
        if (className === 'hero-main-btn') {
          element.textContent = elements[className];
        } else {
          element.textContent = elements[className];
        }
      }
    });

    // تحديث الصورة
    const heroImage = document.querySelector('.hero-side-img');
    if (heroImage && hero.image) {
      heroImage.src = hero.image;
    }

    // إضافة الوصف الثاني إذا كان موجوداً
    const heroDesc2 = document.querySelector('.hero-main-desc:nth-child(3)');
    if (heroDesc2 && hero.desc2) {
      heroDesc2.textContent = hero.desc2;
    }

    console.log('SiteUpdater: تم تحديث قسم Hero');
  }

  // تحديث قسم "من نحن"
  updateAboutSection() {
    if (!this.siteData?.about) return;
    
    const about = this.siteData.about;
    const aboutTitle = document.querySelector('.about-section-title');
    const aboutDesc = document.querySelector('.about-modern-desc p');

    if (aboutTitle) {
      aboutTitle.textContent = about.title;
    }

    if (aboutDesc) {
      aboutDesc.textContent = about.description;
    }

    console.log('SiteUpdater: تم تحديث قسم "من نحن"');
  }

  // تحديث قسم الشركاء
  updatePartnersSection() {
    if (!this.siteData?.partners) return;
    
    const partnersContainer = document.querySelector('.partners-grid, .partners-list');
    if (!partnersContainer) return;

    partnersContainer.innerHTML = '';
    
    this.siteData.partners.forEach(partner => {
      const partnerElement = document.createElement('div');
      partnerElement.className = 'partner-item';
      partnerElement.innerHTML = `
        <img src="${partner.image}" alt="${partner.name}" class="partner-logo">
        <div class="partner-info">
          <h4>${partner.name}</h4>
          <p>${partner.type}</p>
        </div>
      `;
      partnersContainer.appendChild(partnerElement);
    });

    console.log('SiteUpdater: تم تحديث قسم الشركاء');
  }

  // تحديث قسم الخدمات
  updateServicesSection() {
    if (!this.siteData?.services) return;
    
    const servicesContainer = document.querySelector('.services-grid, .services-list');
    if (!servicesContainer) return;

    servicesContainer.innerHTML = '';
    
    this.siteData.services.forEach(service => {
      const serviceElement = document.createElement('div');
      serviceElement.className = 'service-item';
      serviceElement.innerHTML = `
        <div class="service-icon">${service.icon}</div>
        <h4>${service.name}</h4>
      `;
      servicesContainer.appendChild(serviceElement);
    });

    console.log('SiteUpdater: تم تحديث قسم الخدمات');
  }

  // تحديث معلومات التواصل
  updateContactSection() {
    if (!this.siteData?.contact) return;
    
    const contact = this.siteData.contact;
    
    // تحديث رقم الهاتف
    const phoneElements = document.querySelectorAll('.contact-phone, .phone-number');
    phoneElements.forEach(element => {
      element.textContent = contact.phone;
      if (element.tagName === 'A') {
        element.href = `tel:${contact.phone}`;
      }
    });

    // تحديث البريد الإلكتروني
    const emailElements = document.querySelectorAll('.contact-email, .email-address');
    emailElements.forEach(element => {
      element.textContent = contact.email;
      if (element.tagName === 'A') {
        element.href = `mailto:${contact.email}`;
      }
    });

    // تحديث العنوان
    const addressElements = document.querySelectorAll('.contact-address, .address');
    addressElements.forEach(element => {
      element.textContent = contact.address;
    });

    // تحديث الخريطة
    const mapFrame = document.querySelector('.contact-map iframe');
    if (mapFrame && contact.map) {
      mapFrame.src = contact.map;
    }

    console.log('SiteUpdater: تم تحديث معلومات التواصل');
  }

  // تحديث قسم الرؤية والمهمة
  updateVisionSection() {
    if (!this.siteData?.vision) return;
    
    const vision = this.siteData.vision;
    
    // تحديث المهمة
    const missionElements = document.querySelectorAll('.mission-text, .mission-content');
    missionElements.forEach(element => {
      element.innerHTML = `<span class="mission-icon">${vision.mission.icon}</span> ${vision.mission.text}`;
    });

    // تحديث الرؤية
    const visionElements = document.querySelectorAll('.vision-text, .vision-content');
    visionElements.forEach(element => {
      element.innerHTML = `<span class="vision-icon">${vision.vision.icon}</span> ${vision.vision.text}`;
    });

    // تحديث القيم
    const valuesElements = document.querySelectorAll('.values-text, .values-content');
    valuesElements.forEach(element => {
      element.innerHTML = `<span class="values-icon">${vision.values.icon}</span> ${vision.values.text}`;
    });

    console.log('SiteUpdater: تم تحديث قسم الرؤية والمهمة');
  }

  // تحديث قسم "لماذا كرمل+"
  updateWhyKarmelSection() {
    if (!this.siteData?.whyKarmel) return;
    
    const whyKarmel = this.siteData.whyKarmel;
    
    // تحديث العنوان والعنوان الفرعي
    const titleElement = document.querySelector('.why-karmel-title');
    const subtitleElement = document.querySelector('.why-karmel-subtitle');
    
    if (titleElement) titleElement.textContent = whyKarmel.title;
    if (subtitleElement) subtitleElement.textContent = whyKarmel.subtitle;

    // تحديث البطاقات
    const cardsContainer = document.querySelector('.why-karmel-cards, .features-grid');
    if (cardsContainer && whyKarmel.cards) {
      cardsContainer.innerHTML = '';
      
      whyKarmel.cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'why-karmel-card feature-card';
        cardElement.innerHTML = `
          <div class="card-icon">
            <i class="${card.icon}"></i>
          </div>
          <h3>${card.title}</h3>
          <p>${card.desc}</p>
          <div class="card-stat">
            <span class="stat-number">${card.stat}</span>
            <span class="stat-text">${card.statText}</span>
          </div>
        `;
        cardsContainer.appendChild(cardElement);
      });
    }

    console.log('SiteUpdater: تم تحديث قسم "لماذا كرمل+"');
  }

  // تحديث سياسة الخصوصية
  updatePrivacyPolicy() {
    if (!this.siteData?.policies?.privacy) return;
    
    const privacy = this.siteData.policies.privacy;
    const privacyContainer = document.querySelector('.privacy-policy-content');
    
    if (privacyContainer) {
      privacyContainer.innerHTML = `
        <h2>${privacy.title}</h2>
        <p>${privacy.intro}</p>
        <h3>المعلومات التي نجمعها</h3>
        <p>${privacy.infoCollected.replace(/\n/g, '<br>')}</p>
        <h3>كيفية استخدام المعلومات</h3>
        <p>${privacy.infoUsage.replace(/\n/g, '<br>')}</p>
        <h3>حماية المعلومات</h3>
        <p>${privacy.protection.replace(/\n/g, '<br>')}</p>
        <h3>مشاركة المعلومات</h3>
        <p>${privacy.sharing.replace(/\n/g, '<br>')}</p>
        <h3>حقوقك</h3>
        <p>${privacy.rights.replace(/\n/g, '<br>')}</p>
        <h3>التحديثات</h3>
        <p>${privacy.updates}</p>
      `;
    }

    console.log('SiteUpdater: تم تحديث سياسة الخصوصية');
  }

  // تحديث الشروط والأحكام
  updateTermsAndConditions() {
    if (!this.siteData?.policies?.terms) return;
    
    const terms = this.siteData.policies.terms;
    const termsContainer = document.querySelector('.terms-content');
    
    if (termsContainer) {
      termsContainer.innerHTML = `
        <h2>${terms.title}</h2>
        <h3>قبول الشروط</h3>
        <p>${terms.acceptance}</p>
        <h3>الخدمات المقدمة</h3>
        <p>${terms.services.replace(/\n/g, '<br>')}</p>
        <h3>التزاماتنا</h3>
        <p>${terms.commitments.replace(/\n/g, '<br>')}</p>
        <h3>المدفوعات والرسوم</h3>
        <p>${terms.payments.replace(/\n/g, '<br>')}</p>
        <h3>الملكية الفكرية</h3>
        <p>${terms.intellectual.replace(/\n/g, '<br>')}</p>
        <h3>السرية وحماية البيانات</h3>
        <p>${terms.confidentiality.replace(/\n/g, '<br>')}</p>
        <h3>المسؤولية والضمانات</h3>
        <p>${terms.liability.replace(/\n/g, '<br>')}</p>
        <h3>إنهاء الخدمة</h3>
        <p>${terms.termination.replace(/\n/g, '<br>')}</p>
        <h3>القانون المطبق وحل النزاعات</h3>
        <p>${terms.law.replace(/\n/g, '<br>')}</p>
      `;
    }

    console.log('SiteUpdater: تم تحديث الشروط والأحكام');
  }

  // اختبار التحديث
  testUpdate() {
    console.log('SiteUpdater: اختبار التحديث...');
    console.log('البيانات الحالية:', this.siteData);
    this.updateAllSections();
    console.log('SiteUpdater: تم اختبار التحديث بنجاح');
  }

  // الحصول على البيانات الافتراضية
  getDefaultData() {
    return {
      hero: {
        title: "ودّع الإجراءات اليدوية وابدأ التحول الرقمي مع كرمل+",
        desc1: "نقدّم حلولاً ذكية تسرّع إدارة أعمالك وتزيد من دقتها وكفاءتها.",
        desc2: "اختر كرمل+ لتجربة احترافية تسهّل عليك كل خطوة نحو المستقبل.",
        button: "تواصل معنا",
        image: "i14.png"
      },
      about: {
        title: "كرمل: حلول برمجية ذكية بثقة واحتراف",
        description: "نحن في كرمل فريق متخصص في تطوير البرمجيات وتصميم الحلول الرقمية الذكية التي تواكب متطلبات السوق وتواجه التحديات بثقة. نضم مطورين، مصممين، ومهندسي برمجيات يعملون بشغف واحد: تحويل الأفكار إلى حلول تقنية فعّالة. نبدأ بتحليل دقيق لاحتياجات العميل، وننفذ بعناية واحتراف، مع التزام كامل في كل مرحلة من مراحل المشروع — من التخطيط إلى الإطلاق وما بعده. نحرص على أن تكون تجربة التعاون معنا سلسة، مهنية، ومبنية على نتائج حقيقية وثقة تدوم."
      },
      contact: {
        phone: "+972 58-630-0009",
        email: "support@karmelplus.com",
        address: "شعفاط، القدس",
        map: "https://www.google.com/maps?q=Jerusalem%2C%20Shuafat&output=embed"
      },
      partners: [
        { name: "019", type: "شركة اتصالات", image: "i1.png" },
        { name: "Hallo 015", type: "شركة اتصالات", image: "i2.png" },
        { name: "Tranzilla", type: "بوابة دفع", image: "i3.png" },
        { name: "freeRadius", type: "سيرفر راديوس", image: "i4.png" },
        { name: "ريووحيت online", type: "برنامج محاسبة", image: "i5.png" },
        { name: "Priority", type: "برنامج ERP", image: "i6.png" },
        { name: "Golan", type: "شركة اتصالات", image: "i7.png" },
        { name: "Cellcom", type: "شركة اتصالات", image: "i8.png" },
        { name: "We4g", type: "شركة اتصالات", image: "i9.png" },
        { name: "Pelephone", type: "شركة اتصالات", image: "i10.png" },
        { name: "Partner", type: "شركة اتصالات", image: "i11.png" },
        { name: "Hot", type: "شركة اتصالات", image: "i12.png" },
        { name: "OpenOLT", type: "واجهة OLT", image: "i13.png" }
      ],
      services: [
        { name: "نظام إدارة العملاء (CRM)", icon: "🗂️" },
        { name: "دعم فني", icon: "🛠️" },
        { name: "استشارة تقنية", icon: "💡" },
        { name: "تكامل الأنظمة", icon: "🔗" },
        { name: "تدريب الموظفين", icon: "🎓" }
      ],
      vision: {
        mission: { text: "نبتكر حلولاً تقنية تصنع الفرق ونرافقك في كل خطوة من الفكرة حتى الإنجاز.", icon: "🎯" },
        vision: { text: "أن نصبح العلامة التقنية الأولى في القدس ونقود التحول الرقمي بابتكار حقيقي.", icon: "🌟" },
        values: { text: "الثقة، الشغف، الإبداع، والعمل بروح الفريق لتحقيق النجاح المشترك.", icon: "💎" }
      },
      whyKarmel: {
        title: "لماذا كرمل+؟",
        subtitle: "اكتشف الأسباب التي تجعلنا الخيار الأمثل لتحويل أفكارك إلى واقع رقمي متميز",
        cards: [
          {
            icon: "fas fa-rocket",
            title: "سرعة في التنفيذ",
            desc: "نحول أفكارك إلى واقع رقمي بسرعة قياسية مع الحفاظ على أعلى معايير الجودة والاحترافية.",
            stat: "50%",
            statText: "أسرع من المنافسين"
          },
          {
            icon: "fas fa-shield-alt",
            title: "أمان وموثوقية",
            desc: "نضمن أمان بياناتك ومشاريعك مع أحدث تقنيات الحماية والنسخ الاحتياطي التلقائي.",
            stat: "99.9%",
            statText: "معدل الأمان"
          },
          {
            icon: "fas fa-users",
            title: "فريق محترف",
            desc: "فريق من المطورين المحترفين ذوي الخبرة العالية في أحدث التقنيات وأفضل الممارسات.",
            stat: "10+",
            statText: "سنوات خبرة"
          },
          {
            icon: "fas fa-headset",
            title: "دعم مستمر",
            desc: "نقدم دعم فني مستمر وخدمة عملاء متميزة قبل وأثناء وبعد تسليم المشروع.",
            stat: "24/7",
            statText: "دعم متواصل"
          }
        ]
      },
      policies: {
        privacy: {
          title: "سياسة الخصوصية",
          intro: "نحن في شركة كرمل+ نلتزم بحماية خصوصية زوارنا وعملائنا الكرام.",
          infoCollected: "نجمع المعلومات التي تقدمها لنا مباشرة مثل:\n• الاسم الكامل ومعلومات الاتصال\n• البريد الإلكتروني ورقم الهاتف\n• معلومات الشركة أو المؤسسة\n• تفاصيل المشروع والخدمات المطلوبة",
          infoUsage: "نستخدم المعلومات التي نجمعها للأغراض التالية:\n• تقديم خدماتنا المتميزة والرد على استفساراتك\n• تحسين تجربتك معنا وتطوير خدماتنا\n• إرسال التحديثات والعروض الخاصة\n• ضمان الأمان والامتثال للقوانين",
          protection: "نطبق أحدث إجراءات الأمان لحماية معلوماتك الشخصية:\n• تشفير البيانات باستخدام تقنيات SSL متقدمة\n• حماية من الوصول غير المصرح به\n• نسخ احتياطية منتظمة وآمنة\n• مراقبة مستمرة للأنظمة الأمنية",
          sharing: "نلتزم بعدم مشاركة معلوماتك الشخصية مع أطراف ثالثة إلا في الحالات التالية:\n• بموافقتك الصريحة والكتابية\n• عندما يقتضي القانون ذلك\n• لحماية حقوقنا أو حقوق الآخرين",
          rights: "لديك الحقوق التالية فيما يتعلق بمعلوماتك الشخصية:\n• الوصول إلى معلوماتك وتحديثها\n• حذف معلوماتك عند الطلب\n• الاعتراض على معالجة معلوماتك\n• نقل معلوماتك إلى مزود خدمة آخر",
          updates: "قد نحدث هذه السياسة من وقت لآخر لتعكس التغييرات في ممارساتنا أو اللوائح القانونية."
        },
        terms: {
          title: "الشروط والأحكام",
          acceptance: "باستخدام خدمات كرمل+، فإنك توافق على هذه الشروط والأحكام الشاملة.",
          services: "نقدم مجموعة شاملة من الخدمات التقنية المتقدمة:\n• تطوير البرمجيات والمواقع الإلكترونية\n• تطوير التطبيقات المحمولة والويب\n• تصميم واجهات المستخدم (UI/UX)\n• تكامل الأنظمة والخدمات السحابية\n• الدعم الفني والصيانة",
          commitments: "نلتزم بتقديم خدمات عالية الجودة مع:\n• الالتزام بالمواصفات المتفق عليها\n• التسليم في الوقت المحدد\n• الدعم الفني المستمر\n• الشفافية في جميع مراحل المشروع",
          payments: "يتم تحديد أسعار خدماتنا مسبقاً وتوضيحها في العروض المقدمة:\n• الدفع المسبق بنسبة 50% عند بدء المشروع\n• الدفع النهائي عند تسليم المشروع\n• الدفع عبر وسائل آمنة ومقبولة\n• فواتير واضحة ومفصلة",
          intellectual: "نحترم حقوق الملكية الفكرية ونضمن:\n• انتقال جميع حقوق المشروع للعميل بعد الدفع النهائي\n• الاحتفاظ بحقوقنا في التقنيات والأدوات المستخدمة\n• عدم استخدام محتوى العميل لأغراض أخرى\n• حماية سرية المعلومات والبيانات",
          confidentiality: "نلتزم بحماية سرية معلومات العميل من خلال:\n• عدم مشاركة المعلومات مع أطراف ثالثة\n• تطبيق إجراءات أمنية صارمة\n• توقيع اتفاقيات السرية مع الموظفين\n• حماية البيانات وفقاً للقوانين المعمول بها",
          liability: "نلتزم بتقديم خدمات عالية الجودة مع ضمانات محدودة:\n• ضمان عمل المشروع وفقاً للمواصفات المتفق عليها\n• دعم فني مجاني لمدة 3 أشهر بعد التسليم\n• مسؤولية محدودة بقيمة المشروع المتفق عليها\n• عدم ضمان عدم وجود أخطاء برمجية",
          termination: "يمكن إنهاء الخدمة من قبل أي من الطرفين:\n• بإشعار مسبق كتابي لمدة 30 يوماً\n• في حالة عدم الالتزام بالشروط\n• تسوية المدفوعات والالتزامات المتبقية\n• تسليم العمل المنجز حتى تاريخ الإنهاء",
          law: "تخضع هذه الشروط لقانون فلسطين ويتم حل النزاعات من خلال:\n• المحادثات الودية والتفاوض المباشر\n• الوساطة من قبل طرف محايد\n• المحاكم المختصة في فلسطين"
        }
      }
    };
  }

  // تنظيف الموارد عند إغلاق الصفحة
  destroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }
}

// إنشاء مثيل من SiteUpdater عند تحميل الصفحة
let siteUpdater;

document.addEventListener('DOMContentLoaded', function() {
  console.log('إنشاء مثيل SiteUpdater...');
  siteUpdater = new SiteUpdater();
  window.siteUpdater = siteUpdater; // جعلها متاحة عالمياً
});

// تنظيف الموارد عند إغلاق الصفحة
window.addEventListener('beforeunload', function() {
  if (siteUpdater) {
    siteUpdater.destroy();
  }
});

// تصدير الكلاس للاستخدام في ملفات أخرى
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SiteUpdater;
}
