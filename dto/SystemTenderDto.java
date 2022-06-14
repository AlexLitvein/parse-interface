package club.forhouse.dto.tenders;

import lombok.*;


@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemTenderDto {
    private Long tenderId;
    private String title;
    private String dataStart;
    private String address;
    private TCompanyDto customer;
    private String description;
    private Long price;
    private String status;
//    private String titlePlatform;
}
