 
export class InterswitchUtilityService {

   public stringToHash(stringToHash: string) {

        var hash = 0;

        if (stringToHash.length === 0) {
            return hash;
        }

        for (let i = 0; i < stringToHash.length; i++) {
            const char = stringToHash.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash && hash;
        }

        return hash;
    }
}
