## ADDED Requirements

### Requirement: Mobile IM shell follows the demo visual system
The Taro mobile client SHALL present message, contact, profile, and chat screens with the `demo.html` visual system: light gray page background, white rounded cards, blue accent color, avatar-led rows, unread badges, online indicators, and safe-area-aware bottom navigation or composer.

#### Scenario: User opens the message tab
- **WHEN** the user opens the message tab
- **THEN** the page shows a header, search entry, and rounded session cards using the shared light IM visual language

### Requirement: Contact friend entry opens a real private room
The Taro mobile client SHALL request the stable private chat room for a selected friend before navigating to the chat detail page.

#### Scenario: User taps a friend
- **WHEN** the user taps a friend in the contact list
- **THEN** the client calls the private room API with the friend's user ID and navigates using the returned room ID

### Requirement: Chat composer exposes common IM tools
The Taro mobile client SHALL expose voice, text input, emoji, image, and more actions in the chat composer while preserving existing text and image send behavior.

#### Scenario: Composer is empty
- **WHEN** the chat input is empty
- **THEN** the composer shows voice, emoji, image, and more actions

#### Scenario: User types a message
- **WHEN** the user enters non-empty text
- **THEN** the composer shows a send action and can send the text through the existing send message API
