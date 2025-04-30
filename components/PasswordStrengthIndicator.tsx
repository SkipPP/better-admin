type PasswordStrengthIndicatorProps = {
  password: string;
};

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  // Simple strength calculation
  const getStrength = (pwd: string) => {
    if (!pwd) return 0;
    let strength = 0;
    if (pwd.length >= 8) strength += 1;
    if (/[A-Z]/.test(pwd)) strength += 1;
    if (/[0-9]/.test(pwd)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 1;
    return strength;
  };

  const strength = getStrength(password);

  return (
    <div className="mt-1">
      <div className="bg-muted flex h-1.5 w-full overflow-hidden rounded-full">
        <div
          className={`${
            strength === 0
              ? "bg-destructive/50"
              : strength === 1
                ? "bg-destructive"
                : strength === 2
                  ? "bg-orange-500"
                  : strength === 3
                    ? "bg-yellow-500"
                    : "bg-green-500"
          } transition-all duration-300`}
          style={{ width: `${(strength / 4) * 100}%` }}
        />
      </div>

      <p className="text-muted-foreground mt-1 text-xs">
        {strength === 0 && "Très faible"}
        {strength === 1 && "Faible"}
        {strength === 2 && "Moyen"}
        {strength === 3 && "Fort"}
        {strength === 4 && "Très fort"}
      </p>
    </div>
  );
}
