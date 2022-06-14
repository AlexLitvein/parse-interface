package club.forhouse.dto.tenders;

import club.forhouse.entities.tenders.TenderPlatform;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TPlatformDto {

    private Long platformId;
    private String title;

    public TPlatformDto(TenderPlatform tenderPlatform) {
        this.platformId = tenderPlatform.getPlatformId();
        this.title = tenderPlatform.getTitle();
    }
}
