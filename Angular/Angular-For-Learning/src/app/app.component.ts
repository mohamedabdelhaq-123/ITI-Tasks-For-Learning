import { Component } from '@angular/core'; //  Imports the @Component decorator from Angular's core library so you can mark your class as a component.

import { HeroComponent } from './hero/hero.component';
import { AboutComponent } from './about/about.component';
import { SkillsComponent } from './skills/skills.component';
import { projectsComponent } from './porjects/porjects.component';
import { FooterComponent } from './footer/footer.component';

@Component({   // decorate the class as a component
  selector: 'app-root',  // name of the tag (directive) to select the component(way of displaying component) to replace with tag component
  standalone: true,   // doesn't need ngmodule (prev. way before v17) every component is indepenet now
  imports: [      // need to import any component,module, directive  i use here
    
    HeroComponent,   // imported from hero , etc..
    AboutComponent,
    SkillsComponent,
    projectsComponent,
    FooterComponent
  ],
    // template: '<p>hello from appcomp.</p>'   ===> can write all .html in here
  templateUrl: './app.component.html',  //this is the easy way:: path of component .html
    // styles: 'p{color: red}'  ===> can write all .css in here
  styleUrl: './app.component.css'       //this is the easy way:: path of component .css
})
export class AppComponent {   // class decorated (act as component)
  title = 'my-portfolio';
}