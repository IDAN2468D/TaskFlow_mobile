# TaskFlow AI - Quality Assurance & CI/CD Guidelines 🛡️

## 1. Code Quality Standards (Internal & AI)
- **Visual Excellence**: Every UI component must follow the "Obsidian & Indigo" design system. No generic colors. Use HSL-curated palettes only.
- **RTL-First Development**:
    - All Hebrew text must be wrapped in containers with `dir="rtl"` or `textAlign: 'right'`.
    - Use `&rlm;` for Hebrew text and `&lrm;` for English text in mixed strings.
    - Flex direction should be `row-reverse` for headers and tab layouts.
- **Tailwind-Only Styling**:
    - Do not use `StyleSheet.create` for layout or colors. Use NativeWind `className` strings.
    - Custom tokens for spacing and shadows must be defined in `tailwind.config.js`.

## 2. QA Protocols (Manual & Automated)
- **Unit Testing**:
    - Every service in `src/services` must have a corresponding `.test.ts`.
    - Use Jest + React Testing Library for component snapshots.
- **UI/UX Audit**:
    - Verify glassmorphism (BlurView) performance on physical devices.
    - Check Haptic feedback (Expo Haptics) on all primary action buttons.
    - Ensure all `MotiView` animations are smooth and don't drop frames.
- **Cross-Platform Consistency**:
    - Validate that the Auth Handshake works between Web and Mobile on every release.

## 3. CI/CD Pipeline Strategy
- **Continuous Integration**:
    - Run `npm run qa` (expo-doctor + expo-install --check) on every push.
    - Linter checks (ESLint + Prettier) must pass for pull request approval.
- **Continuous Deployment**:
    - Automated EAS (Expo Application Services) builds for `staging` branch.
    - Review builds for every major UI change.
- **Performance Budget**:
    - Mobile bundle size must stay under 50MB.
    - Initial screen render (Dashboard) must be <300ms.

## 4. Antigravity System Branding
- Always use the "Antigravity Core" signature on system screens.
- Branding alignment must strictly follow the user's RTL preferences.
