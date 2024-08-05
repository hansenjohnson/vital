from dataclasses import dataclass, field

@dataclass
class ValidationStatus:
    warnings: list = field(default_factory=list)
    errors: list = field(default_factory=list)