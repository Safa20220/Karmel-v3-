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
    console.log('SiteUpdater: الصفحة الحالية:', window.location.href);
    
    this.loadSiteData();
    this.setupUpdateListener();
    this.updateAllSections();
    
    console.log('SiteUpdater: تمت التهيئة بنجاح');
    console.log('SiteUpdater: البيانات المحملة:', this.siteData);
  }

  // تحميل بيانات الموقع من localStorage
  loadSiteData() {
    try {
      console.log('SiteUpdater: محاولة تحميل البيانات من localStorage...');
      const savedData = localStorage.getItem('karmelSiteData');
      if (savedData) {
        this.siteData = JSON.parse(savedData);
        console.log('SiteUpdater: تم تحميل البيانات من localStorage:', this.siteData);
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
    console.log('SiteUpdater: إعداد مستمع التحديثات...');
    
    // مراقبة التغييرات في localStorage
    window.addEventListener('storage', (e) => {
      if (e.key === 'karmelSiteData' || e.key === 'forceUpdate') {
        console.log('SiteUpdater: تم اكتشاف تحديث جديد في localStorage:', e.key);
        this.loadSiteData();
        this.updateAllSections();
      }
    });

    // فحص التحديثات كل 2 ثانية
    this.updateInterval = setInterval(() => {
      const forceUpdate = localStorage.getItem('forceUpdate');
      if (forceUpdate) {
        console.log('SiteUpdater: تم اكتشاف طلب تحديث إجباري:', forceUpdate);
        localStorage.removeItem('forceUpdate');
        this.loadSiteData();
        this.updateAllSections();
      }
    }, 2000);
    
    console.log('SiteUpdater: تم إعداد مستمع التحديثات بنجاح');
  }

  // تحديث جميع الأقسام
  updateAllSections() {
    console.log('SiteUpdater: تحديث جميع الأقسام...');
    this.updateHeroSection();
    this.updateAboutSection();
    this.updatePartnersSection();
    this.updateServicesSection();
    this.updateFAQSection();
    this.updateFutureTechSection();
    this.updateBlogSection();
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
    
    const partnersContainer = document.querySelector('.partners-grid, .partners-magical-grid');
    if (!partnersContainer) return;

    // حفظ البنية الأساسية للبطاقات
    const originalCards = partnersContainer.querySelectorAll('.partner-card');
    if (originalCards.length === 0) return;

    // تحديث البطاقات الموجودة
    this.siteData.partners.forEach((partner, index) => {
      if (index < originalCards.length) {
        const card = originalCards[index];
        const logo = card.querySelector('.partner-logo');
        const name = card.querySelector('.partner-name');
        const type = card.querySelector('.partner-type');
        
        if (logo) logo.src = partner.image;
        if (name) name.textContent = partner.name;
        if (type) type.textContent = partner.type;
      }
    });

    console.log('SiteUpdater: تم تحديث قسم الشركاء');
  }

  // تحديث قسم الأسئلة الشائعة على الموقع الأساسي
  updateFAQSection() {
    console.log('SiteUpdater: بدء تحديث قسم FAQ...');
    console.log('SiteUpdater: البيانات المتوفرة:', this.siteData?.faq);
    
    if (!this.siteData?.faq) {
      console.log('SiteUpdater: لا توجد بيانات FAQ');
      return;
    }
    
    const faqContainer = document.querySelector('#faq .faq-grid');
    if (!faqContainer) {
      console.error('SiteUpdater: لم يتم العثور على حاوية FAQ');
      return;
    }
    
    console.log('SiteUpdater: تم العثور على حاوية FAQ:', faqContainer);

    const existingItems = Array.from(faqContainer.querySelectorAll('.faq-item'));

    // حدّث العناصر الموجودة أو أنشئ عناصر جديدة إذا لزم
    this.siteData.faq.forEach((faq, index) => {
      let item;
      if (index < existingItems.length) {
        item = existingItems[index];
      } else {
        // إنشاء عنصر جديد عبر الاستنساخ للحفاظ على البنية والأنماط
        if (existingItems.length > 0) {
          item = existingItems[0].cloneNode(true);
          item.classList.remove('active');
          const answerEl = item.querySelector('.faq-answer');
          if (answerEl) answerEl.style.maxHeight = '0';
        } else {
          // في حال عدم وجود عناصر، أنشئ بنية أساسية
          item = document.createElement('div');
          item.className = 'faq-item';
          item.innerHTML = `
            <div class="faq-question">
              <h3><span class="ar"></span><"></span></h3>
              <i class="fas fa-chevron-down"></i>
            </div>
            <div class="faq-answer"><p><span class="ar"></span><"></span></p></div>
          `;
        }
        faqContainer.appendChild(item);

        // أضف مستمع النقر للتبديل
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (question && answer) {
          question.onclick = () => {
            const isActive = item.classList.contains('active');
            // أغلق الباقي
            faqContainer.querySelectorAll('.faq-item').forEach(other => {
              if (other !== item) {
                other.classList.remove('active');
                const otherAns = other.querySelector('.faq-answer');
                if (otherAns) otherAns.style.maxHeight = '0';
              }
            });
            if (isActive) {
              item.classList.remove('active');
              answer.style.maxHeight = '0';
            } else {
              item.classList.add('active');
              answer.style.maxHeight = answer.scrollHeight + 'px';
            }
          };
        }
        existingItems.push(item);
      }

      const qEl = item.querySelector('.faq-question h3 .ar');
      const aEl = item.querySelector('.faq-answer p .ar');
      if (qEl) qEl.textContent = faq.question;
      if (aEl) aEl.textContent = faq.answer;
    });

    // إزالة العناصر الزائدة إن وجدت
    const totalNeeded = this.siteData.faq.length;
    const currentItems = faqContainer.querySelectorAll('.faq-item');
    if (currentItems.length > totalNeeded) {
      for (let i = currentItems.length - 1; i >= totalNeeded; i--) {
        currentItems[i].remove();
      }
    }

    console.log('SiteUpdater: تم تحديث قسم الأسئلة الشائعة (مع إنشاء/إزالة العناصر حسب الحاجة)');
    console.log('SiteUpdater: عدد العناصر النهائي:', faqContainer.querySelectorAll('.faq-item').length);
  }

  // تحديث قسم التقنيات المستقبلية على الموقع الأساسي
  updateFutureTechSection() {
    if (!this.siteData?.futureTech) return;
    const grid = document.querySelector('#future-tech .future-tech-grid');
    if (!grid) return;

    const cards = grid.querySelectorAll('.future-tech-card');
    this.siteData.futureTech.forEach((tech, index) => {
      if (index < cards.length) {
        const card = cards[index];
        const title = card.querySelector('.future-tech-title .ar');
        const desc = card.querySelector('.future-tech-desc .ar');
        const iconEl = card.querySelector('.future-tech-icon i');
        const tagsContainer = card.querySelector('.future-tech-features');
        if (title) title.textContent = tech.name;
        if (desc) desc.textContent = tech.description;
        if (iconEl && tech.icon) {
          const looksLikeFa = tech.icon.includes('fa-') || tech.icon.startsWith('fas ') || tech.icon.startsWith('far ') || tech.icon.startsWith('fab ');
          if (looksLikeFa) {
            iconEl.textContent = '';
            iconEl.className = tech.icon;
          } else {
            iconEl.className = '';
            iconEl.textContent = tech.icon;
          }
        }
        if (tagsContainer) {
          tagsContainer.innerHTML = '';
          (tech.tags || []).forEach(tag => {
            const span = document.createElement('span');
            span.className = 'feature-tag';
            span.textContent = tag;
            tagsContainer.appendChild(span);
          });
        }
      }
    });
    console.log('SiteUpdater: تم تحديث قسم التقنيات المستقبلية');
  }

  // تحديث قسم المدونة والأخبار على الموقع الأساسي
  updateBlogSection() {
    if (!this.siteData?.blog) return;
    const grid = document.querySelector('#blog .blog-grid');
    if (!grid) return;

    const posts = grid.querySelectorAll('.blog-card');
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('ar-SA');
    const getCategoryName = (key) => {
      const map = { technology: 'تقنية', business: 'أعمال', development: 'تطوير', news: 'أخبار' };
      return map[key] || key;
    };

    this.siteData.blog.forEach((post, index) => {
      if (index < posts.length) {
        const card = posts[index];
        const title = card.querySelector('.blog-title .ar');
        const excerpt = card.querySelector('.blog-excerpt .ar');
        const category = card.querySelector('.blog-category');
        const date = card.querySelector('.blog-date');
        if (title) title.textContent = post.title;
        if (excerpt) excerpt.textContent = post.excerpt;
        if (category) category.textContent = getCategoryName(post.category);
        if (date) date.textContent = formatDate(post.date);
      }
    });
    console.log('SiteUpdater: تم تحديث قسم المدونة');
  }

  // تحديث قسم الخدمات
  updateServicesSection() {
    if (!this.siteData?.services) return;
    
    const servicesContainer = document.querySelector('.services-grid, .services-modern-list');
    if (!servicesContainer) return;

    // تحديث الخدمات الموجودة
    const serviceItems = servicesContainer.querySelectorAll('.service-modern-item');
    this.siteData.services.forEach((service, index) => {
      if (index < serviceItems.length) {
        const item = serviceItems[index];
        const icon = item.querySelector('.service-modern-circle span');
        const label = item.querySelector('.service-modern-label');
        
        if (icon) icon.textContent = service.icon;
        if (label) label.textContent = service.name;
      }
    });

    console.log('SiteUpdater: تم تحديث قسم الخدمات');
  }

  // تحديث معلومات التواصل
  updateContactSection() {
    if (!this.siteData?.contact) return;
    
    const contact = this.siteData.contact;
    
    // تحديث رقم الهاتف
    const phoneElements = document.querySelectorAll('.contact-phone');
    phoneElements.forEach(element => {
      element.textContent = contact.phone;
    });

    // تحديث البريد الإلكتروني
    const emailElements = document.querySelectorAll('.contact-email');
    emailElements.forEach(element => {
      element.textContent = contact.email;
      if (element.tagName === 'A') {
        element.href = `mailto:${contact.email}`;
      }
    });

    // تحديث العنوان
    const addressElements = document.querySelectorAll('.contact-address');
    addressElements.forEach(element => {
      element.textContent = contact.address;
    });

    // تحديث الخريطة
    const mapFrame = document.querySelector('.contact-map-iframe');
    if (mapFrame && contact.map) {
      mapFrame.src = contact.map;
    }

    console.log('SiteUpdater: تم تحديث معلومات التواصل');
  }

  // تحديث قسم الرؤية والمهمة
  updateVisionSection() {
    if (!this.siteData?.vision) return;
    
    const vision = this.siteData.vision;
    
    // البحث عن عناصر الرؤية والمهمة في الصفحة
    const missionElements = document.querySelectorAll('[class*="mission"]');
    const visionElements = document.querySelectorAll('[class*="vision"]');
    const valuesElements = document.querySelectorAll('[class*="values"]');

    // تحديث المهمة إذا وجدت
    if (missionElements.length > 0) {
      missionElements.forEach(element => {
        element.innerHTML = `<span class="mission-icon">${vision.mission.icon}</span> ${vision.mission.text}`;
      });
    }

    // تحديث الرؤية إذا وجدت
    if (visionElements.length > 0) {
      visionElements.forEach(element => {
        element.innerHTML = `<span class="vision-icon">${vision.vision.icon}</span> ${vision.vision.text}`;
      });
    }

    // تحديث القيم إذا وجدت
    if (valuesElements.length > 0) {
      valuesElements.forEach(element => {
        element.innerHTML = `<span class="values-icon">${vision.values.icon}</span> ${vision.values.text}`;
      });
    }

    console.log('SiteUpdater: تم تحديث قسم الرؤية والمهمة');
  }

  // تحديث قسم "لماذا كرمل+"
  updateWhyKarmelSection() {
    if (!this.siteData?.whyKarmel) return;
    
    const whyKarmel = this.siteData.whyKarmel;
    
    // تحديث العنوان والعنوان الفرعي
    const titleElement = document.querySelector('.why-karmel-section .section-title-main .ar');
    const subtitleElement = document.querySelector('.why-karmel-subtitle .ar');
    
    if (titleElement) titleElement.textContent = whyKarmel.title;
    if (subtitleElement) subtitleElement.textContent = whyKarmel.subtitle;

    // تحديث البطاقات
    const cardsContainer = document.querySelector('.why-karmel-grid');
    if (cardsContainer && whyKarmel.cards) {
      const existingCards = cardsContainer.querySelectorAll('.why-karmel-card');
      
      whyKarmel.cards.forEach((card, index) => {
        if (index < existingCards.length) {
          const cardElement = existingCards[index];
          const icon = cardElement.querySelector('.why-karmel-icon i');
          const title = cardElement.querySelector('.why-karmel-title .ar');
          const desc = cardElement.querySelector('.why-karmel-desc .ar');
          const statNumber = cardElement.querySelector('.stat-number');
          const statLabel = cardElement.querySelector('.stat-label');
          
          if (icon) icon.className = card.icon;
          if (title) title.textContent = card.title;
          if (desc) desc.textContent = card.desc;
          if (statNumber) statNumber.textContent = card.stat;
          if (statLabel) statLabel.textContent = card.statText;
        }
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
