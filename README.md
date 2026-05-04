# NotifiCore

**A robust, provider-agnostic notification microservice built with pure Hexagonal Architecture.**

NotifiCore is a meticulously crafted Node.js/NestJS project designed to demonstrate advanced software engineering principles. It prioritizes extreme decoupling, strict business rule enforcement, and high maintainability by strictly adhering to the Ports and Adapters pattern.

---

## 🛑 The Problem

In enterprise systems, the notification domain frequently suffers from **high infrastructure volatility and external dependencies**. It's common to start a project sending emails via AWS SES, later migrate to SendGrid, or add SMS providers like Twilio.

Without a clear architectural boundary, business logic (such as a _No-Disturb_ rule that prevents sending messages late at night) becomes harmfully intertwined with third-party SDKs and web frameworks. The result is fragile code that is hard to test and becomes a logistical nightmare whenever a provider needs to be replaced.

## 💡 The Solution (Architecture)

NotifiCore solves this problem by completely isolating the domain through **Hexagonal Architecture (Ports and Adapters)**. The design is sliced into three shielded layers:

1. **Domain (The Center of the Hexagon):** Holds the entities (`Notification`), business rules (e.g., _No-Disturb_), and Domain Errors. This layer is entirely free from any external library or framework.
2. **Application (The Boundary):** Orchestrates the data flow through Use Cases (`SendNotificationUseCase`) and defines the **Ports** (Interfaces), dictating the contract that the outside world must respect to communicate with the Core.
3. **Infrastructure (The Outside World):** Where NestJS lives. This layer is responsible for the **Adapters**, which implement the Ports to persist data (`InMemoryNotificationRepository`) or dispatch messages (`ConsoleMailProvider`, `SmsTwilioAdapter`), as well as the **Controllers** that handle HTTP requests (Inbound).

### 🛡️ The _Result_ Pattern

To avoid the _Try/Catch Hell_ anti-pattern and the leaking of silent technical exceptions, the system adopts the **Result Pattern**. Every domain operation returns a predictable object indicating `Success` or `Failure`, forcing the consumer (such as the Controller) to handle failures explicitly, mapped in a semantic way.

---

## ✨ Technical Highlights

- **Framework Independence:** The `core/` folder (Domain + Application) is completely unaware of NestJS's existence. If there is a need to migrate to Express, Fastify, or a pure Node Worker, **not a single line** of business code will need to be rewritten.
- **Extreme Testability:** Due to Port isolation, Use Cases are unit-tested in fractions of a second using simple Mocks, ensuring the integrity of business rules without the need to initialize complex databases or Docker containers.
- **Dependency Inversion Principle (DIP):** Use Cases do not instantiate adapters; they require interfaces. The NestJS Dependency Injection container is configured in the module to provide the concrete class (`useClass`), allowing us to swap Twilio for a test console by changing just **one line** of configuration.

---

## 🗺️ Architectural Flow

```text
[ CLIENT ]
    │ (HTTP Request)
    ▼
┌────────────────────────────────────────────────────────┐
│ INFRASTRUCTURE (Outer Hexagon)                         │
│                                                        │
│  [ NotificationsController ] (Inbound Adapter)         │
│               │                                        │
└───────────────┼────────────────────────────────────────┘
                │ (Data Transfer Object)
                ▼
┌───────────────┼────────────────────────────────────────┐
│ APPLICATION   │  (Inner Hexagon Border)                │
│               ▼                                        │
│      [ SendNotificationUseCase ]                       │
│               │                                        │
│     ┌─────────┴─────────┐                              │
│     │                   │                              │
│ [ Port: Repository ]  [ Port: MessageProvider ]        │
└─────┼───────────────────┼──────────────────────────────┘
      │                   │
      ▼                   ▼
┌─────┼───────────────────┼──────────────────────────────┐
│ INFRASTRUCTURE (Outer Hexagon)                         │
│                                                        │
│ [ InMemoryRepo ]     [ ConsoleMail / SmsTwilio ]       │
│ (Outbound Adapter)   (Outbound Adapters)               │
└────────────────────────────────────────────────────────┘
```

---

## 🚀 How to Run

The project uses the `pnpm` package manager (although `npm` is also supported).

```bash
# Clone the repository
git clone https://github.com/your-username/notificore.git
cd notificore

# Install dependencies
pnpm install

# Run the domain tests (Fast, no infra dependencies)
pnpm run test

# Start the server in development mode
pnpm run start:dev
```

---

## 📚 References & Inspirations

This architectural design was not created by chance. It draws directly from the definitive sources on sustainable software engineering:

- **Hexagonal Architecture (Ports and Adapters)** conceived by _Alistair Cockburn_.
- **Clean Architecture** outlined by _Robert C. Martin (Uncle Bob)_.
- **Domain-Driven Design (DDD)** core concepts by _Eric Evans_.
