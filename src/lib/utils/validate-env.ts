import { ClassConstructor, plainToInstance } from 'class-transformer'
import { validateSync } from 'class-validator'

export function validateEnv<T extends object>(
    config: Record<string, string | undefined>,
    envVariablesClass: ClassConstructor<T>
): T {
    const validatedConfig = plainToInstance(envVariablesClass, config, {
        enableImplicitConversion: true
    })

    const errors = validateSync(validatedConfig, {
        skipMissingProperties: false
    })

    if (errors.length > 0) {
        const errorMsg = errors
            .map(
                error =>
                    `\nError in ${error.property}:\n` +
                    Object.entries(error.constraints!)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join('\n')
            )
            .join('\n')

        console.error(`Config validation error: ${errorMsg}`)
        throw new Error(`Config validation error: ${errorMsg}`)
    }

    return validatedConfig
}
