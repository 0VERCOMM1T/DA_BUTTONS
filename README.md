# 🎛️ DA BUTTONS

   A customizable audio soundboard web application that allows users to create, manage, and play audio buttons with custom labels, images, and colors. Built with React and powered by client-side storage for offline functionality.

## 🎯 What We Built

DA BUTTONS is a personal audio soundboard application that provides:

- **Audio Button Grid**: Create and organize custom audio buttons in a responsive grid layout
- **Custom Audio Upload**: Upload and store audio files directly in the browser
- **Visual Customization**: Add custom background images or solid colors to buttons
- **Label Management**: Rename buttons with custom labels or use original filenames
- **Offline Storage**: All data persists locally using IndexedDB - no server required

## 🛠️ Tools & Technologies Used

### Frontend Framework & Build Tools
- **React 18.2.0**
- **Vite 5.0.0**
- **@vitejs/plugin-react**

### Data Storage
- **IndexedDB via idb (v7.1.1)**: Client-side database for persistent storage of:
  - Audio file blobs
  - Background images
  - Button metadata (labels, colors, filenames)
  - No server or backend required - everything runs in the browser

### Styling & UI
- **CSS3**: Custom styling with:
  - CSS Grid for responsive button layout
  - CSS Flexbox for component alignment
  - CSS animations for playing state feedback
  - Mobile-first responsive design
  - Dark theme with modern UI aesthetics

## 📱 Usage

1. **Add Audio Buttons**: Click the "+ Add Button" button to upload audio files
2. **Play Audio**: Click any button to play the associated audio
3. **Customize Appearance**: 
   - Click the 🖼️ icon to add a background image
   - Use the color picker to set a solid background color
   - Click the 🗑️ Img button to remove background images
4. **Edit Labels**: Click the ✏️ icon to rename buttons
5. **Delete Buttons**: Click the 🗑️ button to remove buttons entirely

## 🏗️ Architecture

### Data Flow
1. User interactions trigger state updates in React components
2. Changes are persisted to IndexedDB via the `db.js` module
3. UI updates reflect the new state optimistically
4. All data persists between browser sessions

## 🎨 Design Philosophy

- **Offline-First**: No server dependency - everything works locally
- **Performance**: Minimal bundle size with Vite's optimized build
- **Accessibility**: Keyboard navigation and semantic HTML
- **Mobile-Friendly**: Touch-optimized with responsive grid layout
- **User-Centric**: Intuitive controls with immediate visual feedback

## 🔧 Technical Highlights

- **Memory Management**: Proper cleanup of audio URLs and event listeners
- **Error Handling**: Graceful handling of file uploads and storage operations
- **Performance**: Efficient re-renders with React's reconciliation
- **Storage Optimization**: Blob storage for binary data, minimal metadata storage

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---
