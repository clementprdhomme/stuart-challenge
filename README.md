# stuart-challenge

![Screenshot of the project](https://raw.githubusercontent.com/clementprdhomme/stuart-challenge/master/hero.png)

This repository is my answer to a challenge [Stuart](http://www.stuart.com), a company dedicated to short-distance and fast courier delivering service, proposed to me.

The aim was to create a responsive homepage for their company with an autoplaying background video as header. The challenge must be done in less than 4 hours. I roughly worked 5 hours on it 😜.

## Focus areas

From the beginning, my idea was to make the website mobile-first, make it load as fast as possible and give it incredible performance for less capable devices. Also, because the challenge was focused on the HTML and the CSS, I decided to use vanilla Javascript.

Below, I'll explain how I achieved solid performance for all the animated elements, how I improved the loading performance, the development environment, the code structure and I'll detail a bit more the key components with what you can do to improve them.

### 60 FPS performance 💪

To understand the impact of animating DOM elements, you must understand the three steps the browser goes through in order to render the page:

1. **Layout**: it computes the position of the elements
2. **Paint**: it fills each pixel with the color
3. **Composite**: it composes the different layers

To find more information about this process, you can read [this article](http://www.html5rocks.com/en/tutorials/speed/high-performance-animations/).

To have great performance, we want to skip some of the steps. As they work as a cascade, each time the browser goes through the layout, it needs to go through the 2 other steps, but if it goes directly to the last one, we reduce the duration of the computations and thus have better performance.

So to have better performance we would ideally only apply transitions on CSS properties that only trigger the composite step. According to [CSS Triggers](https://csstriggers.com), only `transform` and `opacity` just trigger composite (1). Thus, I tried to only use them for the animations. For example, the mobile drawer (the navigation menu which appears from the left) and the dropdown from the desktop navigation menu only use `transform`. On the contrary, even if the hamburger menu on mobile uses `transform` to make all of its transformation, its color change from white to dark grey has to be done with a property triggering paint.

Furthermore, to even do better, we can limit the layout and paint computations to only happen within a specific DOM element by promoting it to its own composite layer with the property `will-change`. In addition, the property tells the browser to make under-the-hood optimizations such as using the GPU. On this project, I used it twice: for the mobile drawer which needs outstanding performance on mobile and for the dropdown menu.

(1) This is only true on Chrome. Other browsers may evolve so it's a good practice to use it already.

### Fast loading 🏎💨

In order to have quicker page load, we have three main pivotal actions:

1. reducing the **file sizes**
2. reducing the **number of requests**
3. improving the **perception of performance**

To apply the first point, I decided to minimize all the SVG and JPEG images of the project using tools such as [svgo](https://github.com/svg/svgo) or [ImageOptim](https://imageoptim.com/). The gain was approximately of 8%, which is not much, but can make the difference on bigger websites. Also, the build process minifies the HTML and CSS output files (1).

For the second point, I didn't do much apart from inline the logo of Stuart inside the HTML. It's the only request I could save in such a small project.

Finally, the last point is definitely the one I paid more attention to. After making the previous optimizations, we can still do more by giving the impression to the user that the website is ready even it's not yet, and at the same time, giving him/her hints of what's still loading. That's what I did to all the photos and the video by loading them lazily.

Here is the pattern I followed:
- Display a placeholder: really tiny small version of the images (mostly < 1kB) which will occupy the same space but is blurred due to its size
- Loop through all the photos and the video (hidden behind the placeholder) to start loading them
- Once one of the media is loaded, make a smooth transition between the placeholder and the real media

This way, we can vastly improve the perception of speed of the website, especially on 3G connection where the images take seconds to load.

(1) The JS file should be minified too. It's not the case here as the gulp configuration has been taken from my [personal website](https://github.com/clementprdhomme/personal-website) which doesn't have any Javascript.

## Development environment

The project is based on [Gulp](http://gulpjs.com), which provides the server, the "watch" feature and the build and minimize processes of the files.

For the CSS, I decided to use [PostCSS](https://github.com/postcss/postcss) for being lightweight and modular and to enable code splitting, nesting, variables, simpler media queries and to auto-prefix the rules for the browsers with at least a 5% share.

To use the development environment, please first install Gulp:

`$ npm install -g gulp`

And then install all the dependencies:

`$ npm install`

Finally, run the server:

`$ gulp`

If you just want to build the project, run:

`$ gulp build`

You will find the built bundle inside the `dist/` folder.

## Code architecture

In the `src/` folder, you'll find all the source code:
- `index.html`: the only HTML file
- `main.js`: the only JS file, used for the lazy-loading and the navigation menu interactions
- `styles/`: the folder containing all the styles
- `images/`: the folder containing the images and the video (it should probably be renamed "assets")

In order to build a modular website, I divided some parts of the interface into components. The buttons, the titles, the cards, the header and the hero are the pieces I think needed to be modular. Each of these components has its dedicated CSS file (in `styles/components`) and has a special class to differentiate it from the others. For example, a title has the class `.c-title` and the header also has the class `.c-header`.

In addition, we need to be able to position them and to give some styles to the elements which aren't components. To do so, I created a folder called `styles/layouts/` in which you can find the stylesheets dedicated to special layouts. In this case, we just have one layout: `homepage`.

If you want to learn more about this CSS architecture, you should read more about [RSCSS](http://rscss.io) which provides a way to organize the components, their variants and the layouts.

To extend even further the modularity, I decided to have two other important files: `base.css` and `settings.css`. The first one defines the basic styles for the whole website and the second defines all the fonts, font sizes, font weights, colors and breakpoints across the application. You shouldn't use any value for these properties that aren't present in this file.

One note about the JS file: it should probably be minimized before heading to production and being [deferred](https://developers.google.com/speed/docs/insights/BlockingJS#InlineJS) instead of blocking the HTML parsing as of now.

## Further explanations

To let you understand a bit deeper my choices and decisions, I'll give more explanations about some components and share with you some notes I took during the coding session.

### Lazy-loaded elements

![GIF of a lazy-loading image](https://raw.githubusercontent.com/clementprdhomme/stuart-challenge/master/lazy-loading.gif)

To build the smooth and nice animation of the lazy-loaded images, I used a smaller version of them (10px-high versions of them) that I minified and converted to base64 to include them directly in the CSS stylesheet. The choice to include them in the stylesheet is due to the fact that we want to display them instantly so the white text doesn't appear during a few seconds on a white background, and to the fact that because they weigh less than 1kB, it's counter productive to have a request hand-shake to retrieve them.

Concerning the real images, they are included in the HTML file but don't load because the `src` attribute is not set. In fact, the path of the images is stored inside another attribute: `data-src`. It enables the website to only load the images when needed. Ideally, it would have been great to only load them when they would be visible in the viewport, but as I only worked a few hours on the project, I decided to load all of them at once, when the JS runs.

The way the smooth animation works is as follow: before anything, we set all the images to a opacity 0 and add a transition on it, then we set their `src` attribute so they start loading, then we listen to their `load` event, finally, when triggered, we change the opacity of the image to 1.

There's one last detail you need to know about the images and the video. In order to give them the "cover" positioning their placeholders have, I had to use a property called `object-fit`, but it comes with a trade-off: Internet Explorer [doesn't support it](http://caniuse.com/#search=object-fit).

### Navigation menu

![GIF of the mobile drawer](https://raw.githubusercontent.com/clementprdhomme/stuart-challenge/master/mobile-drawer.gif)

The navigation menu is one of the elements where I spent most of the time. Initially, I wanted to have just one HTML markup for the mobile and desktop versions, but it appeared that trying to reuse most of the elements of the mobile menu and the drawer and the desktop made the code really complicated and less legible whereas I could repeat the elements and have a simpler structure to be have a nice and easy-to-explain component. After some hesitations, I decided to go over the second solution.

Another important decision was to put the drawer inside of the navigation menu and not outside in order to follow the component scheme (i.e. having just one root element).

If you plan to reuse the code of the drawer and the dropdown, please notice that there's no accessibility feature built inside of it. You should probably add some [aria](http://www.w3.org/WAI/intro/aria) labels such as `aria-hidden` and `aria-controls`.

Please, also note that when loading the website for the first time on mobile, the drawer will start in an opened state and will disappear quickly as the page loads. It's a known issue you should address before using it on production.

### Hero

The hero component is formed by an absolutely-positioned image, an absolutely-positioned video and the absolutely-positioned content, each one on top of the previous ones (in the same order). Its root element also has a background image used to make the nice lazy-loading effect.

Because mobile connections are slower and the background video weighs around 11MB, I decided to use a photo as hero and not the video for mobile users. Using media queries, the hero thus displays whether the placeholder background for the photo or the video (using the first frame of it). Also, the Javascript uses the same breakpoint to know whether it should load the photo or the video.

This works well but it's doesn't really do what we need: we want the video to only load on fast connections instead of targeting the viewport's width of the user's device. Unfortunately, there's no way to do that so I decided to only show the video for devices that could be considered as tablets (devices with a width >= 768px) as they are more often used at home with a Wifi connection.

Another issue of this solution is that it doesn't work well on iPad. Because it has a large width, the website shows the video instead of the photo, nevertheless it's never played. The reason is that Apple decided to prevent the video to automatically play without the action of the user:
> In Safari on iOS (for all devices, including iPad), where the user may be on a cellular network and be charged per data unit, preload and autoplay are disabled. No data is loaded until the user initiates it

[Reference here](https://developer.apple.com/library/safari/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/Device-SpecificConsiderations/Device-SpecificConsiderations.html)

In this particular case, it would then be better to also display the image. It's a solution that would require a bit more of Javascript and [UA sniffing](https://en.wikipedia.org/wiki/Browser_sniffing). If you plan to reuse the code, don't forget to think about it (i.e. it's not covered in this repository).

Finally, while reading the CSS file attached to this component, you may ask what's the aim of these lines:
```javascript
.background-video {
  [...]
  /* The next two properties are used to hide the black bars from the video
   * as it's not correctly cropped */
  height: 138.46%;
  transform: translateY(-13.89%);
  [...]
}
```

Well, the video used for this example contained two black bars on each side because it hasn't been exported correctly. In order to remove them, you can use some professional (paid) software, but because I don't own myself any video-editing program, I decided to just scale and translate the video so the bars are outside of the component. It's a tricky solution, I know, but it was the quickest and easiest to get things done. Please, do not assume it is a correct solution, just crop the video (bonus: you'll even have a lighter file).
