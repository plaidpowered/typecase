function typecaseAccordionTabInstall(selector) {

    if (selector === undefined) {
        selector = ".wp-block-typecase-accordion-tabs";
    }

    var typecaseAccordions = document.querySelectorAll(selector);

    if (! typecaseAccordions.length) {
        return;
    }

    for (i = 0; i < typecaseAccordions.length; i += 1) {

        var thisAccordion = typecaseAccordions[i],
            a11yTabs = document.createElement("ul"),
            a11yAcc = document.createElement("ul"),                
            sections,
            useTabs = thisAccordion.classList.contains("__use-tabs"),
            openFirst = ! thisAccordion.classList.contains("__load-collapsed") || useTabs;

        a11yAcc.className = thisAccordion.className;            

        if (useTabs) {                

            a11yTabs.dataset.mobileWidth = thisAccordion.getAttribute("data-mobile-width") || 600;

            var a11yNav = document.createElement("nav"),
                a11yNavLeft = document.createElement("button"),
                a11yNavRight = document.createElement("button");

            a11yNav.classList.add("wp-block-typecase-accordion-tabs--nav");
            a11yTabs.classList.add("wp-block-typecase-accordion-tabs--tabs");

            a11yTabs.ariaControls = a11yAcc;

            a11yTabs.xOffset = 0;

            a11yNavLeft.classList.add("wp-block-typecase-accordion-tabs--nav--scroll");
            a11yNavLeft.classList.add("__left");
            a11yNavLeft.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M13.293 6.293L7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z"/></svg>';
            a11yNavLeft.addEventListener('click', typecaseAccordionTabScroll)
            a11yNavLeft.ariaControls = a11yTabs;
            
            a11yNavRight.classList.add("wp-block-typecase-accordion-tabs--nav--scroll");
            a11yNavRight.classList.add("__right");
            a11yNavRight.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M10.707 17.707L16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z"/></svg>';
            a11yNavRight.addEventListener('click', typecaseAccordionTabScroll)
            a11yNavRight.ariaControls = a11yTabs;

            a11yNav.append(a11yNavLeft);
            a11yNav.append(a11yNavRight);
            a11yNav.append(a11yTabs);   
            
            /*if (window.innerWidth <= a11yTabs.dataset.mobileWidth) {
                a11yTabs.classList.add("__mobile-tabs");
            }*/

        }

        sections = thisAccordion.querySelectorAll(".wp-block-typecase-accordion-tabs-content");
        for (j = 0; j < sections.length; j += 1) {

            var a11ySection = document.createElement("li"),
                a11yButton = document.createElement("button"),
                a11yContent = document.createElement("div"),
                sectionTitle = sections[j].querySelector(".--title"),
                contentId = "accordion_" + i + "--section_" + j;

            a11yButton.setAttribute("aria-controls", contentId);
            a11yButton.setAttribute("aria-expanded", j === 0 && openFirst ? "true" : "false");
            a11yButton.innerHTML = sectionTitle.innerHTML;
            a11yButton.addEventListener('click', typecaseAccordionTabToggle);     
            a11yButton.classList.add("wp-block-typecase-accordion-tabs--toggle")

            a11yContent.innerHTML = sections[j].querySelector(".--content").innerHTML;
            a11yContent.prepend(sectionTitle);
            a11yContent.setAttribute("aria-hidden", j === 0 && openFirst ? "false" : "true");
            a11yContent.id = contentId;
            a11yContent.classList.add("wp-block-typecase-accordion-tabs-content");
            a11yContent.ariaContrlledBy = a11yButton;

            a11yButton.ariaControls = a11yContent;

            if (! useTabs) {
                a11ySection.append(a11yButton);
            } else {
                var dummyLi = document.createElement("li");
                dummyLi.append(a11yButton);
                a11yTabs.append(dummyLi);
            }

            a11ySection.append(a11yContent);

            a11yAcc.append(a11ySection);

            document.dispatchEvent(new CustomEvent('typecase|accordion-tabs:setup-section', {detail: 
                { accordion: a11yAcc, section: a11ySection, content: a11yContent, button: a11yButton }
            }));
            
        }

        a11yAcc.classList.add("__ready");                
        thisAccordion.parentNode.replaceChild(a11yAcc, thisAccordion);
                
        if (useTabs) {
            a11yAcc.parentNode.insertBefore(a11yNav, a11yAcc);
            a11yAcc.ariaNavigation = a11yNav;          
            
            document.dispatchEvent(new CustomEvent('typecase|accordion-tabs:installed-tabs', {detail: 
                { accordion: a11yAcc, navigation: a11yNav }
            }));

        } else {

            document.dispatchEvent(new CustomEvent('typecase|accordion-tabs:installed-accordion', {detail: 
                { accordion: a11yAcc }
            }));

        }

        

    }

    typecaseAccordionResetNavigation(null, selector);

    window.addEventListener("scroll", typecaseAccordionResetNavigation);

}

function typecaseAccordionTabToggle(e) {

    if (!! e) {
        e.preventDefault();
    }

    var thisButton = e.currentTarget,
        thisContent = thisButton.ariaControls,
        expanded = thisButton.getAttribute("aria-expanded"),
        thisAccordion = thisButton.parentNode.parentNode,
        thisTabgroup,
        usesTabs = false;

    if (thisAccordion.classList.contains("wp-block-typecase-accordion-tabs--tabs")) {
        usesTabs = true;
        thisTabgroup = thisAccordion;
        thisAccordion = thisTabgroup.ariaControls;            
    }

    if (expanded === "true") {

        if (usesTabs) {
            return;
        }

        thisButton.setAttribute("aria-expanded", "false");
        thisContent.setAttribute("aria-hidden", "true");

        document.dispatchEvent(new CustomEvent('typecase|accordion-tabs:closed', {detail: 
            { accordion: thisAccordion, button: thisButton, content: thisContent, tabs: thisTabgroup }
        }));

    } else {

        if (usesTabs || thisAccordion.classList.contains("__auto-close")) {

            var allTabs = thisAccordion.querySelectorAll(".wp-block-typecase-accordion-tabs-content");

            for(i = 0; i < allTabs.length; i += 1) {
                allTabs[i].ariaContrlledBy.setAttribute("aria-expanded", "false");
                allTabs[i].setAttribute("aria-hidden", "true");
            }

            if (usesTabs) {
                typecaseAccordionShowActiveTab(thisTabgroup, thisButton);
            }

        }

        thisButton.setAttribute("aria-expanded", "true");
        thisContent.setAttribute("aria-hidden", "false");

        console.log(thisButton, thisContent);

        document.dispatchEvent(new CustomEvent('typecase|accordion-tabs:opened', {detail: 
            { accordion: thisAccordion, button: thisButton, content: thisContent, tabs: thisTabgroup }
        }));

        thisContent.dispatchEvent(new CustomEvent('typecase|accordion-tab:opened', {detail: 
            { accordion: thisAccordion, button: thisButton, tabs: thisTabgroup }
        }));
    }

    document.dispatchEvent(new CustomEvent('typecase|accordion-tabs:changed', {detail: {
        
        accordion: thisButton.parentNode.parentNode, 
        button: thisButton, 
        content: thisContent, 
        action: expanded ? "closed" : "opened"

    }}));

}

function typecaseAccordionShowActiveTab(tabgroup, tab) {

    var tabgroupNavRect = tabgroup.parentNode.getBoundingClientRect(),
        tabRect = tab.getBoundingClientRect(),
        leftButtonRect = tabgroup.parentNode.querySelector(".__left").getBoundingClientRect(),
        rightButtonRect = tabgroup.parentNode.querySelector(".__right").getBoundingClientRect();

    if (tabRect.x + tabRect.width > tabgroupNavRect.x + tabgroupNavRect.width - rightButtonRect.width) {

        tabgroup.xOffset += tabgroupNavRect.x + tabgroupNavRect.width - rightButtonRect.width - tabRect.x - tabRect.width;
        tabgroup.style.transform = 'translateX(' + tabgroup.xOffset + 'px)';

    } else if (tabRect.x < tabgroupNavRect.x + leftButtonRect.width) {

        tabgroup.xOffset += tabgroupNavRect.x - tabRect.x + leftButtonRect.width;
        tabgroup.style.transform = 'translateX(' + tabgroup.xOffset + 'px)';

    }

    typecaseAccordionResetNavigation();

}

function typecaseAccordionResetNavigation(e, selector) {

    if (!! e) {
        e.preventDefault();
    }

    var typecaseAccordions;

    if (selector === undefined) {
        selector = ".wp-block-typecase-accordion-tabs";
    }

    typecaseAccordions = document.querySelectorAll(selector);

    for(var i = 0; i < typecaseAccordions.length; i += 1) {

        var thisAccordion = typecaseAccordions[i],
            thisNav,
            navList,
            thisNavRect,
            navListRect,
            leftButton,
            rightButton, 
            useMobileTabs = false;

        if (! thisAccordion.classList.contains("__use-tabs")) {
            continue;
        }

        thisNav = thisAccordion.ariaNavigation;

        if (! thisNav) {
            continue;
        }

        navList = thisNav.querySelector(".wp-block-typecase-accordion-tabs--tabs");

        if (! navList) {
            continue;
        }

        thisNav.classList.remove("__mobile-tabs");

        if (window.innerWidth <= parseInt(navList.dataset.mobileWidth, 10)) {
            thisNav.classList.add("__mobile-tabs");
            thisNav.classList.add("__has-scroll-buttons");
            useMobileTabs = true;
            navList.xOffset = 0;
            navList.style.transform = 'translateX(0)';

            /*var selectedNav = navList.querySelector('button[aria-expanded="true"]');
            if (selectedNav) {
                selectedNav.parentNode.style.width = navList.getBoundingClientRect().width + "px";
            }*/
        }

        leftButton = thisNav.querySelector(".__left");
        rightButton = thisNav.querySelector(".__right");            

        leftButton.classList.remove("__disabled");
        rightButton.classList.remove("__disabled");
        
        if (useMobileTabs) {
            return;
        }

        navListRect = navList.getBoundingClientRect();
        thisNavRect = thisNav.getBoundingClientRect();

        if (navListRect.width >= thisNavRect.width) {
            thisNav.classList.add("__has-scroll-buttons");
        } else {
            thisNav.classList.remove("__has-scroll-buttons");
        }

        if (navList.xOffset >= 0) {
            navList.xOffset = 0;
            navList.style.transform = 'translateX(0)';
            leftButton.classList.add("__disabled");
        } else if (navList.xOffset + navListRect.width < thisNavRect.width) {
            navList.xOffset = thisNavRect.width - navListRect.width;
            navList.style.transform = 'translateX(' + navList.xOffset + 'px)';
            rightButton.classList.add("__disabled");
        }

        

    }

}

function typecaseAccordionTabScroll(e) {

    if (!! e) {
        e.preventDefault();
    }

    var thisScrollButton = e.currentTarget
        direction = thisScrollButton.classList.contains("__left") ? 1 : -1,
        thisNavgroup = thisScrollButton.parentNode,
        thisTabgroup = thisNavgroup.querySelector(".wp-block-typecase-accordion-tabs--tabs"),
        offset = 0;

    if (thisNavgroup.classList.contains("__mobile-tabs")) {

        typecaseAccordionResetNavigation(); 

        var selectedTab = thisTabgroup.querySelector('button[aria-expanded="true"]'),
            nextTab;

        if (direction === -1) {   //right
            nextTab = selectedTab.parentNode.nextElementSibling;
            if (! nextTab) {
                nextTab = thisTabgroup.querySelector("li:first-child");
            }
        } else { // left
            nextTab = selectedTab.parentNode.previousElementSibling;
            if (! nextTab) {
                nextTab = thisTabgroup.querySelector("li:last-child");
            }
        }

        nextTab = nextTab.querySelector("button");

        selectedTab.setAttribute("aria-expanded", "false");
        selectedTab.ariaControls.setAttribute("aria-hidden", "true");

        nextTab.setAttribute("aria-expanded", "true");
        nextTab.ariaControls.setAttribute("aria-hidden", "false");

        thisTabgroup.style.transform = 'translateX(-' + (nextTab.parentNode.getBoundingClientRect().x - thisTabgroup.getBoundingClientRect().x) + "px)";
        //nextTab.width = thisTabgroup.getBoundingClientRect().width;

    } else {

        offset = thisNavgroup.getBoundingClientRect().width * direction;

        thisTabgroup.xOffset += offset;
        thisTabgroup.style.transform = 'translateX(' + thisTabgroup.xOffset + 'px)';

        typecaseAccordionResetNavigation(); 

    }

}

(function () {
    
    var typecaseAccordions;

    typecaseAccordionTabInstall();    

    (function() {
        var throttle = function(type, name, obj) {
            obj = obj || window;
            var running = false;
            var func = function() {
                if (running) { return; }
                running = true;
                 requestAnimationFrame(function() {
                    obj.dispatchEvent(new CustomEvent(name));
                    running = false;
                });
            };
            obj.addEventListener(type, func);
        };
    
        /* init - you can init any event */
        throttle("resize", "optimizedResize");
        throttle("scroll", "optimizedScroll");
    })();
    
    // handle event
    window.addEventListener("optimizedResize", typecaseAccordionResetNavigation);
    document.addEventListener("optimizedScroll", typecaseAccordionResetNavigation);        

    if ( typeof window.CustomEvent === "function" ) return false;
    
    function CustomEvent ( event, params ) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent( 'CustomEvent' );
        evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
        return evt;
        }
    
    CustomEvent.prototype = window.Event.prototype;
    
    window.CustomEvent = CustomEvent;

}());