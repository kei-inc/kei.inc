document.addEventListener('DOMContentLoaded', function() {
   // Select all slide divs
    let slides = document.querySelectorAll('div[id^="slide"]');
    let currentSlide = 0;
    let isAnimating = false;
    let direction = 1;
    let animationStage = 0; 
    
    let cursor = document.createElement('span');
    cursor.className = 'cursor';

    let typingSpeed = 50;
    let erasingSpeed = 10;
    let scribbleInSpeed = 20; // Speed for scribble drawing animation
    let scribbleOutSpeed = 50; // Speed for scribble erasing animation

/* --------- CORE ANIMATION STUFF ---------- */   

    // Object to control animation
    let animationControl = {
        cancel: null
    };

    /**
     * Wraps words in spans for animation while preserving spaces and structure
     * @param {HTMLElement} element - The element to process
     */
function wrapWords(element) {
         if (element.querySelector('.word')) return;
     
         function processNode(node) {
             if (node.nodeType === Node.TEXT_NODE) {
                 const words = node.textContent.split(/(\s+)/);
                 const fragment = document.createDocumentFragment();
                 words.forEach((word, index) => {
                     if (index % 2 === 0 && word.trim()) {
                         const span = document.createElement('span');
                         span.className = 'word';
                         span.textContent = word;
                         fragment.appendChild(span);
                     } else {
                         fragment.appendChild(document.createTextNode(word));
                     }
                 });
                 node.parentNode.replaceChild(fragment, node);
             } else if (node.nodeType === Node.ELEMENT_NODE) {
                 if (node.tagName.toLowerCase() === 'em') {
                     // Preserve em tags
                     const span = document.createElement('span');
                     span.className = 'word';
                     span.appendChild(node.cloneNode(true));
                     node.parentNode.replaceChild(span, node);
                 } else if (node.classList.contains('scribblable')) {
                     // Process scribblable span content
                     const fragment = document.createDocumentFragment();
                     Array.from(node.childNodes).forEach(child => {
                         if (child.nodeType === Node.TEXT_NODE) {
                             const words = child.textContent.split(/(\s+)/);
                             words.forEach((word, index) => {
                                 if (index % 2 === 0 && word.trim()) {
                                     const span = document.createElement('span');
                                     span.className = 'word';
                                     span.textContent = word;
                                     fragment.appendChild(span);
                                 } else {
                                     fragment.appendChild(document.createTextNode(word));
                                 }
                             });
                         } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName.toLowerCase() === 'em') {
                             const span = document.createElement('span');
                             span.className = 'word';
                             span.appendChild(child.cloneNode(true));
                             fragment.appendChild(span);
                         } else {
                             fragment.appendChild(child.cloneNode(true));
                         }
                     });
                     node.innerHTML = '';
                     node.appendChild(fragment);
                 } else {
                     Array.from(node.childNodes).forEach(processNode);
                 }
             }
         }
     
         Array.from(element.childNodes).forEach(processNode);
     }

    /**
     * Animates words appearing one by one
     * @param {HTMLElement} element - The element containing the words
     * @param {Function} callback - Function to call when animation completes
     */
    function animateWordsIn(element, callback) {
        let words = element.querySelectorAll('.word');
        let index = 0;
        function showNextWord() {
            if (index < words.length) {
                words[index].style.opacity = '1';
                scrollIfNeeded(words[index]);
                index++;
                animationControl.cancel = setTimeout(showNextWord, typingSpeed);
            } else {
                callback();
            }
        }
        showNextWord();
    }

    /**
     * Animates words disappearing one by one
     * @param {HTMLElement} element - The element containing the words
     * @param {Function} callback - Function to call when animation completes
     */
    function animateWordsOut(element, callback) {
        let words = element.querySelectorAll('.word');
        let index = words.length - 1;
        function hideNextWord() {
            if (index >= 0) {
                words[index].style.opacity = '0';
                index--;
                animationControl.cancel = setTimeout(hideNextWord, erasingSpeed);
            } else {
                callback();
            }
        }
        hideNextWord();
    }
    function scrollIfNeeded(element) {
        const rect = element.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const buffer = 50; // Pixels from bottom before scrolling
    
        if (rect.bottom > viewportHeight - buffer) {
            const scrollAmount = rect.bottom - (viewportHeight - buffer);
            window.scrollBy({
                top: scrollAmount,
                behavior: 'smooth'
            });
        }
    }
    
/* --------- END OF CORE ANIMATION STUFF ---------- */   
    
    
/* --------- SLIDE CHANGE STUFF ---------- */  
    /**
     * Animates a slide in or out
     * @param {HTMLElement} slide - The slide to animate
     * @param {boolean} isIn - True if animating in, false if animating out
     * @returns {Promise} Resolves when animation completes
     */
     let instructionSpan;
     
     function animateSlide(slide, isIn) {
         return new Promise((resolve) => {
             let span = slide.querySelector('span');
             if (isIn) {
                 wrapWords(span);
                 // Scroll to top before starting new slide animation
                 window.scrollTo({
                     top: 0,
                     behavior: 'smooth'
                 });
                 setTimeout(() => {
                     animateWordsIn(span, () => {
                         span.appendChild(cursor);
                         
                         // Add instruction span for the first slide
                         if (currentSlide === 0) {
                             instructionSpan = document.createElement('span');
                             instructionSpan.className = 'light';
                             instructionSpan.textContent = 'press Enter ↵ or click';
                             span.appendChild(instructionSpan);
                         }
                         
                         addRoughUnderlines(slide);
                         resolve();
                     });
                 }, 300); // Small delay to allow smooth scroll to complete
             } else {
                 cursor.remove();
                 if (instructionSpan) {
                     instructionSpan.remove();
                     instructionSpan = null;
                 }
                 clearUnderlines(slide);
                 animateWordsOut(span, () => {
                     slide.style.display = 'none';
                     resolve();
                 });
             }
         });
     }


    /**
     * Changes to the next or previous slide
     */
async function changeSlide() {
         if (isAnimating) return;
     
         let currentSlideElement = slides[currentSlide];
         let hasScribbleable = currentSlideElement.querySelector('.scribblable');
         let hasScribbled = currentSlideElement.querySelector('.scribbled');
     
         if (direction === 1 && hasScribbleable && animationStage === 0) {
             toggleScribble(currentSlideElement, true);
             animationStage = 1;
             addRoughUnderlines(currentSlideElement);
             return;
         } else if (direction === -1 && hasScribbled && animationStage === 1) {
             toggleScribble(currentSlideElement, false);
             animationStage = 0;
             clearUnderlines(currentSlideElement);
             return;
         } else if (direction === -1 && animationStage === 0) {
             let nextSlide = currentSlide - 1;
             if (nextSlide < 0) return;
     
             isAnimating = true;
             if (currentSlideElement.querySelector('.scribbled')) {
                 toggleScribble(currentSlideElement, false);
             }
             // Remove instruction span when changing slides
              if (instructionSpan) {
                  instructionSpan.remove();
                  instructionSpan = null;
              }
             await animateSlide(currentSlideElement, false);
             currentSlide = nextSlide;
             currentSlideElement = slides[currentSlide];
             currentSlideElement.style.display = 'block';
             let words = currentSlideElement.querySelectorAll('.word');
             words.forEach(word => word.style.opacity = '1');
             if (currentSlideElement.querySelector('.scribblable')) {
                 toggleScribble(currentSlideElement, true);
                 animationStage = 1;
             } else {
                 animationStage = 0;
             }
             currentSlideElement.querySelector('span').appendChild(cursor);
             isAnimating = false;
             return;
         }
     
        let nextSlide = currentSlide + direction;
        if (nextSlide >= slides.length) {
            jumpToEnd();
            return;
        }
     
         isAnimating = true;
     
         if (currentSlideElement.querySelector('.scribbled')) {
             toggleScribble(currentSlideElement, false);
         }
     
         await animateSlide(slides[currentSlide], false);
         
         removeAllScribbles();
         
         currentSlide = nextSlide;
         slides[currentSlide].style.display = 'block';
         await animateSlide(slides[currentSlide], true);
     
         isAnimating = false;
         animationStage = 0;
     }
     function jumpToEnd() {
         // Hide all slides
         slides.forEach(slide => {
             slide.style.display = 'none';
             clearUnderlines(slide);
         });
     
         // Show the formlessHolder
         const formlessHolder = document.getElementById('formlessHolder');
         if (formlessHolder) {
             formlessHolder.style.display = 'block';
         }
         
        const mainSection = document.querySelector('main');
         if (mainSection) {
             mainSection.removeEventListener('touchstart', handleTouch);
             mainSection.removeEventListener('click', handleClick);
         }
        
         // Remove all event listeners
          window.removeEventListener('keydown', handleKeydown);
          window.removeEventListener('resize', resizeCanvases);
          window.removeEventListener('keydown', handleEscapeKey);
          document.removeEventListener('touchstart', handleTouch);
          document.removeEventListener('click', handleClick);
     
         // Remove any ongoing animations or timeouts
         if (animationControl.cancel) {
             clearTimeout(animationControl.cancel);
         }
     
         console.log('Jumped to end. All event listeners removed.');
     }
    
/* --------- END OF SLIDE CHANGE STUFF ---------- */   
 
/* --------- SCRIBBLE RELATED STUFF ---------- */

    /**
     * Generates a random number within a specified range
     * @param {number} min - The minimum value
     * @param {number} max - The maximum value
     * @returns {number} A random number between min and max
     */
    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    /**
     * Creates a canvas element for a line of text
     * @param {HTMLElement} element - The scribblable element
     * @param {DOMRect} lineRect - The bounding rectangle of the line
     * @param {DOMRect} parentDivRect - The bounding rectangle of the parent div
     * @param {boolean} isFirstLine - Whether this is the first line of the scribble
     * @param {number} unscribbledWidth - The width of the unscribbled span
     * @returns {HTMLCanvasElement} The created canvas element
     */
function createScribbleCanvas(element, lineRect, parentDivRect, isFirstLine, unscribbledSpan) {
    const canvas = document.createElement('canvas');
    canvas.className = 'scribble-canvas';
    canvas.width = Math.max(1, lineRect.width);
    canvas.height = Math.max(1, lineRect.height);
    
   const mobile =  isMobile();
   
   
    unscribbledWidth = unscribbledSpan.getBoundingClientRect().width;
    unscribbledHeight = unscribbledSpan.getBoundingClientRect().height;
    unscribbledLeft = unscribbledSpan.getBoundingClientRect().left;
    //console.log(unscribbledSpan.getBoundingClientRect().height);

    //console.log(unscribbledHeight+ " "+lineRect.width+ " "+parentDivRect.width);
    //console.log(element.offsetLeft);
    
    if (isFirstLine && (unscribbledHeight <= lineRect.height) && (unscribbledWidth < (parentDivRect.width-120))) {
      //console.log("the first line of text but only one line and not the full width");
      // the first line of text but only one line and not the full width

      canvas.style.top = `${lineRect.top - parentDivRect.top}px`;
      canvas.style.left = '0px';
   }else if(unscribbledWidth > (parentDivRect.width - 150) && unscribbledHeight <= lineRect.height) {
      // the first line but it is the full width
      //console.log('the first line is the full width and all lines after that');

      singleHeight =  (lineRect.top - parentDivRect.top) - unscribbledHeight;
      canvas.style.top = `${singleHeight}px`;
      canvas.style.left = `0px`;
        
   }else if(isFirstLine && unscribbledHeight > lineRect.height ) {
      // the first line but it has broken on to two or more lines
      //console.log('the first line but it has broken on to two or more lines');

       canvas.style.top = `0px`;
       canvas.style.left = `0px`;
   }else if(!isFirstLine && unscribbledHeight > lineRect.height ) {
      // the following lines after the first has broken on to two or more lines 
      //console.log('the following lines after the first has broken on to two or more lines');
      //console.log(unscribbledHeight-5+" "+lineRect.height*2);
      if((unscribbledHeight-5) > (lineRect.height*2)){
         console.log('the following lines after the first has broken on to three or more lines');
         //if wrapped on to 3 or more lines
         
         if(mobile){
            secondHeight = ((lineRect.top - parentDivRect.top) - unscribbledHeight+lineRect.height)-8;
         }else{
            secondHeight = (lineRect.top - parentDivRect.top) - unscribbledHeight+lineRect.height;
         }
      }else{
         console.log('the following lines after the first has broken on to two lines');
         //if wrapped onto two lines
        // secondHeight = (lineRect.top - parentDivRect.top) - lineRect.height;
         
         if(mobile){
            secondHeight =  ((lineRect.top+15) -parentDivRect.top) - unscribbledHeight;
         }else{
            secondHeight =  (lineRect.top - parentDivRect.top) - unscribbledHeight;
         }
      }
     
      if(mobile){
         linePos = element.offsetLeft - 0;
      }else{
        linePos = element.offsetLeft - 20; 
      }
      canvas.style.top = `${secondHeight}px`;
      canvas.style.left = `-${linePos}px`;
   }else{
      //console.log('regular line left aligned');
      canvas.style.top = `${lineRect.top - parentDivRect.top}px`;
      canvas.style.left = `-${unscribbledWidth+8}px`;
    }
    
    element.appendChild(canvas);
    return canvas;
}

function resizeCanvases() {
    const scribbleElements = document.querySelectorAll('.scribbled');
    scribbleElements.forEach(element => {
        const canvases = element.querySelectorAll('.scribble-canvas');
        canvases.forEach(canvas => canvas.remove());
        
        const lineRects = getLineRects(element);
        const parentDiv = element.closest('div');
        const parentDivRect = parentDiv.getBoundingClientRect();
        
        const unscribbledSpan = parentDiv.querySelector('.unscribbled');
       // const unscribbledWidth = unscribbledSpan ? unscribbledSpan.getBoundingClientRect().width : 0;

        lineRects.forEach((lineRect, index) => {
            const isFirstLine = index === 0;
            const canvas = createScribbleCanvas(element, lineRect, parentDivRect, isFirstLine, unscribbledSpan);
            
            // Clear the scribble cache for this canvas
            scribbleCache.delete(canvas);
            
            // Generate new scribble points
            const amplitudeRange = { min: 8, max: 12 };
         const amplitude = randomInRange(amplitudeRange.min, amplitudeRange.max);
            const scribblePoints = generateScribblePoints(
                0,
                canvas.width,
                canvas.height / 2,
                amplitude,
                0.1 // frequency is not used in the new implementation, but kept for consistency
            );
            scribbleCache.set(canvas, scribblePoints);
            
            // Redraw the full scribble
            const rc = rough.canvas(canvas);
            rc.curve(scribblePoints, {
                roughness: randomInRange(1, 2),
                strokeWidth: mobileStroke(),
                stroke: '#435861',
                bowing: randomInRange(0.5, 1.5)
            });
        });
    });
    const currentSlideElement = slides[currentSlide];
    if (currentSlideElement) {
        clearUnderlines(currentSlideElement);
        addRoughUnderlines(currentSlideElement);
    }
}


const scribbleCache = new WeakMap();

/**
 * Animates the scribble drawing
 * @param {HTMLCanvasElement} canvas - The canvas to draw on
 * @param {number} progress - The current progress of the animation (0 to 1)
 */
function animateScribbleIn(canvas, progress) {
    const rc = rough.canvas(canvas);
    const width = canvas.width;
    const height = canvas.height;
    const mobile =  isMobile();
    // Check if canvas has valid dimensions
    if (width <= 0 || height <= 0) {
        console.error('Invalid canvas dimensions:', width, height);
        return;
    }

    if (scribbleCache.has(canvas)) {
        scribblePoints = scribbleCache.get(canvas);
    } else {
        // Generate scribble points only once per canvas
  
        const amplitudeRange = { min: 6, max: 12 };
        const amplitude = randomInRange(amplitudeRange.min, amplitudeRange.max);
        scribblePoints = generateScribblePoints(
            0,
            width,
            height / 2,
            amplitude,
            0.1 // frequency is not used in the new implementation, but kept for consistency
        );
        scribbleCache.set(canvas, scribblePoints);
    }

    // Check if scribblePoints is not empty
    if (scribblePoints.length === 0) {
        console.error('No scribble points generated');
        return;
    }

    // Calculate how many points to draw based on progress
    const pointsToDraw = Math.max(2, Math.floor(scribblePoints.length * progress));

    // Clear the canvas before redrawing
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, width, height);

    try {
     
        rc.curve(scribblePoints.slice(0, pointsToDraw), {
            roughness: randomInRange(1, 2),
            strokeWidth: mobileStroke(),
            stroke: '#435861',
            bowing: randomInRange(0.5, 1.5)
        });
    } catch (error) {
        console.error('Error drawing curve:', error);
        return;
    }

    if (progress < 1) {
        requestAnimationFrame(() => animateScribbleIn(canvas, progress + scribbleInSpeed / 100));
    }
}

function generateScribblePoints(startX, endX, y, amplitude, frequency) {
    const points = [];
    const segmentWidth = 4; // Width of each back-and-forth segment
    const numSegments = Math.floor((endX - startX) / segmentWidth);

    for (let i = 0; i < numSegments; i++) {
        const segmentStartX = startX + i * segmentWidth;
        const segmentEndX = segmentStartX + segmentWidth;
        
        // Add a point at the start of the segment
        points.push([segmentStartX, y + (Math.random() - 0.5) * amplitude * 2]);
        
        // Add a point in the middle of the segment
        points.push([
            (segmentStartX + segmentEndX) / 2,
            y + (Math.random() - 0.5) * amplitude * 2
        ]);
        
        // Add a point at the end of the segment
        points.push([segmentEndX, y + (Math.random() - 0.5) * amplitude * 2]);
    }

    return points;
}

    /**
     * Animates the scribble erasing
     * @param {HTMLCanvasElement} canvas - The canvas to erase from
     * @param {number} progress - The current progress of the animation (0 to 1)
     */
    function animateScribbleOut(canvas, progress) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (progress < 1) {
            ctx.globalAlpha = 1 - progress;
            animateScribbleIn(canvas, 1); // Redraw the full scribble with decreasing opacity
            ctx.globalAlpha = 1;
            requestAnimationFrame(() => animateScribbleOut(canvas, progress + scribbleOutSpeed / 100));
        } else {
            canvas.remove(); // Remove the canvas when fully erased
        }
    }

    /**
     * Gets the bounding rectangles for each line of text in an element
     * @param {HTMLElement} element - The element containing the text
     * @returns {DOMRect[]} An array of DOMRect objects for each line
     */
    function getLineRects(element) {
        const range = document.createRange();
        const lineRects = [];
        const words = element.querySelectorAll('.word');
        
        words.forEach((word, index) => {
            range.selectNodeContents(word);
            const rects = range.getClientRects();
            if (rects.length > 0) {
                if (index === 0 || rects[0].top !== lineRects[lineRects.length - 1].top) {
                    lineRects.push(rects[0]);
                } else {
                    const lastRect = lineRects[lineRects.length - 1];
                    lastRect.width = rects[0].right - lastRect.left;
                }
            }
        });

        return lineRects;
    }

    /**
     * Toggles the scribbled effect on the scribblable element
     * @param {HTMLElement} slide - The current slide
     * @param {boolean} scribble - True to add scribble, false to remove
     */
function toggleScribble(slide, scribble) {
    let scribbleElements = slide.querySelectorAll('.scribblable, .scribbled');
    scribbleElements.forEach(element => {
        if (scribble) {
            element.classList.remove('scribblable');
            element.classList.add('scribbled');
            const lineRects = getLineRects(element);
            const parentDiv = element.closest('div');
            const parentDivRect = parentDiv.getBoundingClientRect();
            
            const unscribbledSpan = parentDiv.querySelector('.unscribbled');
            //console.log(parentDiv.querySelector('.unscribbled').getBoundingClientRect().right);
            //const unscribbledWidth = unscribbledSpan ? unscribbledSpan.getBoundingClientRect().width : 0;
         
         //console.log(unscribbledWidth);
            lineRects.forEach((lineRect, index) => {
                const isFirstLine = index === 0;
                const canvas = createScribbleCanvas(element, lineRect, parentDivRect, isFirstLine, unscribbledSpan);
                animateScribbleIn(canvas, 0); // Start the scribble animation
            });
        } else {
            element.classList.remove('scribbled');
            element.classList.add('scribblable');
            const canvases = element.querySelectorAll('.scribble-canvas');
            canvases.forEach(canvas => animateScribbleOut(canvas, 0)); // Start the erase animation
        }
    });
}

    /**
     * Removes all scribbled classes from all slides
     */
    function removeAllScribbles() {
        slides.forEach(slide => {
            let scribbledElements = slide.querySelectorAll('.scribbled');
            scribbledElements.forEach(element => {
                element.classList.remove('scribbled');
                element.classList.add('scribblable');
                const canvases = element.querySelectorAll('.scribble-canvas');
                canvases.forEach(canvas => canvas.remove());
            });
        });
    }
  function addRoughUnderlines(slide) {
      const emTags = slide.querySelectorAll('em');
      if (emTags.length === 0) return;  // No em tags in this slide
  
      let canvas = slide.querySelector('.rough-underline-canvas');
      if (!canvas) {
          canvas = document.createElement('canvas');
          canvas.className = 'rough-underline-canvas';
          slide.appendChild(canvas);
      }
  
      const slideRect = slide.getBoundingClientRect();
      canvas.width = slideRect.width;
      canvas.height = slideRect.height;
      canvas.style.opacity = '1';
  
      const rc = rough.canvas(canvas);
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      emTags.forEach(em => {
          const range = document.createRange();
          range.selectNodeContents(em);
          const rects = range.getClientRects();
  
          for (let i = 0; i < rects.length; i++) {
              const rect = rects[i];
              const startX = rect.left - slideRect.left;
              const endX = rect.right - slideRect.left;
              const y = rect.bottom - slideRect.top;
  
              // Adjust the line position slightly upwards
              const adjustedY = y - 2;
  
              rc.line(
                  startX, 
                  adjustedY, 
                  endX, 
                  adjustedY, 
                  {
                      roughness: 2,
                      strokeWidth: 2,
                      stroke: window.getComputedStyle(em).color,
                      bowing: 1
                  }
              );
  
              // If this is not the last line and the next line starts further right,
              // draw a connecting line
              if (i < rects.length - 1 && rects[i + 1].left > rect.right) {
                  rc.line(
                      endX,
                      adjustedY,
                      rects[i + 1].left - slideRect.left,
                      adjustedY,
                      {
                          roughness: 2,
                          strokeWidth: 2,
                          stroke: window.getComputedStyle(em).color,
                          bowing: 1
                      }
                  );
              }
          }
      });
  }
    function clearUnderlines(slide) {
        const canvas = slide.querySelector('.rough-underline-canvas');
        if (canvas) {
            canvas.style.opacity = '0';
        }
    }
/* --------- END OF SCRIBBLE RELATED STUFF ---------- */


    /**
     * Handles keyboard events for navigation
     * @param {KeyboardEvent} event - The keyboard event
     */
    function handleKeydown(event) {
        if (event.key === 'Escape') {
            jumpToEnd();
        }else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
            direction = 1;
            changeSlide();
        } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
            direction = -1;
            changeSlide();
        }else{
           direction = 1;
            changeSlide();
        }
    }
    
function handleTouch(event) {
        // Check if the touch occurred within the main section
        if (!event.target.closest('main')) return;
    
        // Prevent default behavior to avoid scrolling
        event.preventDefault();
    
        const touchX = event.touches[0].clientX;
        const screenWidth = window.innerWidth;
    
        if (touchX < screenWidth / 2) {
            // Touch on the left half of the screen, simulate left arrow
            handleKeydown({ key: 'ArrowLeft' });
        } else {
            // Touch on the right half of the screen, simulate right arrow
            handleKeydown({ key: 'ArrowRight' });
        }
    }
    function isMobile(){
       if(window.innerWidth <= 768){
          return true;
       }else{
          return false;
       }
    }
    function mobileStroke(){
        if(window.innerWidth <= 768){
           return 1.5;
        }else{
           return 2;
        }
     }
    
    function addNavigationListeners() {
        const mainSection = document.querySelector('main');
        
        if (mainSection) {
            // Touch events
            mainSection.addEventListener('touchstart', handleTouch, { passive: false });
    
            // Mouse events (for desktop)
            mainSection.addEventListener('click', handleClick);
        } else {
            console.warn('Main section not found. Navigation listeners not added.');
        }
    
        // Keyboard events (keep the existing listener)
        window.addEventListener('keydown', handleKeydown);
    }
    
function handleClick(event) {
        // Check if the click occurred within the main section
        if (!event.target.closest('main')) return;
    
        const clickX = event.clientX;
        const screenWidth = window.innerWidth;
    
        if (clickX < screenWidth / 2) {
            // Click on the left half of the screen, simulate left arrow
            handleKeydown({ key: 'ArrowLeft' });
        } else {
            // Click on the right half of the screen, simulate right arrow
            handleKeydown({ key: 'ArrowRight' });
        }
    }
    // Add event listeners
    addNavigationListeners();
    window.addEventListener('resize', resizeCanvases);

    // Initialize all slides by wrapping words
    slides.forEach(slide => wrapWords(slide.querySelector('span')));

    // Initialize the first slide
    slides[0].style.display = 'block';
    animateSlide(slides[0], true);
    });