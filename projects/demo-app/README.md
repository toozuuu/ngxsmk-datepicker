# ngxsmk-datepicker Demo Application

A comprehensive demo application showcasing all features and capabilities of the `ngxsmk-datepicker` component. This demo serves as both a testing ground and documentation for developers.

## 🌐 Live Demo

**Try it online**: [https://stackblitz.com/~/github.com/toozuuu/ngxsmk-datepicker](https://stackblitz.com/~/github.com/toozuuu/ngxsmk-datepicker)

The live demo runs directly in your browser without any installation required!

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 9+
- Angular 17+

### Running the Demo

1. **Clone the repository:**
   ```bash
   git clone https://github.com/toozuuu/ngxsmk-datepicker.git
   cd ngxsmk-datepicker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   Navigate to `http://localhost:4200`

## 📱 Demo Features

### 🎁 Holiday Provider Integration
- **Smart Holiday Detection**: Automatically marks US holidays
- **Custom Holiday Provider**: Implements `HolidayProvider` interface
- **Toggle Functionality**: Enable/disable holiday restrictions
- **Visual Indicators**: Holidays are highlighted in the calendar

### 📅 Single Date Selection
- **Popover Calendar**: Clean, intuitive date selection
- **Weekend Restrictions**: Disable weekends with `isInvalidDate`
- **Theme Support**: Light and dark mode compatibility
- **Form Integration**: Reactive forms with validation

### 📊 Inline Range Picker
- **Always Visible**: Calendar is always displayed (`inline="true"`)
- **Range Selection**: Select start and end dates
- **Toggle Controls**: Enable/disable the datepicker
- **Status Display**: Shows form control status

### ⏰ Date Range with Time
- **Time Selection**: Hour, minute, and AM/PM controls
- **Predefined Ranges**: Quick selection options (Today, Last 7 Days, etc.)
- **Weekend Filtering**: Automatic weekend date disabling
- **15-minute Intervals**: Configurable time precision

### 📋 Multiple Date Selection
- **Non-contiguous Dates**: Select multiple individual dates
- **Action Tracking**: Real-time event logging
- **Weekend Restrictions**: Consistent with other demos
- **Event Handling**: Comprehensive action event system

## 🎨 Theme Support

The demo includes a theme toggle that switches between:
- **Light Theme**: Clean, modern appearance
- **Dark Theme**: Dark background with light text
- **Automatic Adaptation**: All components adapt to theme changes

## 🔧 Technical Implementation

### Component Structure
```typescript
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NgxsmkDatepickerComponent, ReactiveFormsModule, JsonPipe],
  // ... component configuration
})
export class App {
  // Form controls and configuration
  public datepickerForm = new FormGroup({
    singleDate: new FormControl(),
    singleDate2: new FormControl(),
    inlineRange: new FormControl(),
    rangeWithTime: new FormControl(),
    multipleDates: new FormControl<Date[] | null>(null),
  });
}
```

### Holiday Provider Implementation
```typescript
class SampleHolidayProvider implements HolidayProvider {
  private readonly holidays: { [key: string]: string } = {
    '2025-01-01': 'New Year\'s Day',
    '2025-01-20': 'MLK Jr. Day',
    // ... more holidays
  };

  isHoliday(date: Date): boolean {
    const key = this.formatDateKey(date);
    return !!this.holidays[key];
  }
}
```

## 📊 Performance Metrics

The demo showcases the optimized performance:
- **30% Smaller Bundle**: Reduced bundle size through optimization
- **40% Faster Rendering**: OnPush change detection strategy
- **60% Faster Selection**: Memoized date comparisons

## 🎯 Browser Compatibility

Tested on:
- **Chrome** 90+ ✅
- **Firefox** 88+ ✅
- **Safari** 14+ ✅
- **Edge** 90+ ✅
- **Mobile Safari** 14+ ✅
- **Chrome Mobile** 90+ ✅

## 🛠️ Development

### Available Scripts
```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

### Project Structure
```
demo-app/
├── src/
│   ├── app/
│   │   ├── app.ts              # Main demo component
│   │   ├── app.config.ts       # App configuration
│   │   └── app.routes.ts       # Routing configuration
│   ├── index.html              # HTML template
│   └── styles.scss             # Global styles
├── public/
│   └── favicon.ico              # App icon
└── README.md                   # This file
```

## 🎨 Customization

### CSS Variables
The demo uses CSS custom properties for theming:
```css
:host {
  --datepicker-primary-color: #6d28d9;
  --datepicker-primary-contrast: #ffffff;
  --datepicker-range-background: #f5f3ff;
  --datepicker-background: #ffffff;
  --datepicker-text-color: #222428;
  --datepicker-subtle-text-color: #9ca3af;
  --datepicker-border-color: #e9e9e9;
  --datepicker-hover-background: #f0f0f0;
}
```

### Dark Theme
```css
:host(.dark-theme) {
  --datepicker-range-background: rgba(139, 92, 246, 0.2);
  --datepicker-background: #1f2937;
  --datepicker-text-color: #d1d5db;
  --datepicker-subtle-text-color: #6b7280;
  --datepicker-border-color: #4b5563;
  --datepicker-hover-background: #374151;
  background-color: #111827;
}
```

## 📱 Responsive Design

The demo is fully responsive and works on:
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (320px - 767px)

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   npm start -- --port 4201
   ```

2. **Build errors:**
   ```bash
   npm run build
   ```

3. **Dependency issues:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

## 📄 License

This demo application is part of the ngxsmk-datepicker project and is licensed under the MIT License.

## 👨‍💻 Author

**Sachin Dilshan**
- 📧 Email: [sachindilshan040@gmail.com](mailto:sachindilshan040@gmail.com)
- 🐙 GitHub: [@toozuuu](https://github.com/toozuuu)

## 🤝 Contributing

Contributions to the demo app are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📚 Related Documentation

- [Main Library README](../README.md)
- [API Documentation](../projects/ngxsmk-datepicker/README.md)
- [GitHub Repository](https://github.com/toozuuu/ngxsmk-datepicker)
- [NPM Package](https://www.npmjs.com/package/ngxsmk-datepicker)